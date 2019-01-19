import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch, withRouter} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {addRequestInterceptor, addResponseInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";
import {articleService} from './article';
import {feed} from "./feed";
import {commentService} from "./comment";
import {tagService} from "./tag";


// TODO: when going Home from any other page request to Global Feed gets initiated and immediately canceled
// TODO: handle errors properly (e.g on 404 the loader is stuck because isReady is never reset)
addRequestInterceptor((url, options) => {
    const token = jwt.get();
    if (token) {
        options.headers['Authorization'] = `Token ${token}`;
    }

    return [url, options];
});

addResponseInterceptor((response) => {
    // not authorized
    if (response.status === 401) {
        // TODO: get a new token and retry the request? or log out user?
        user.logOut();
    }

    return response;
});

// TODO: read page number from URL
// TODO: make pagination.js module to handle page enumeration logic
function feedFactory(dataSource, queryParams) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.PAGE_LIMIT = 10;
            this.defaultQueryParams = {...queryParams};
            if (this.props.tag) {
                this.defaultQueryParams.tag = this.props.tag;
            }
            this.state = {
                feed: [],
                isReady: false,
                pageNumber: 1,
                totalArticles: 0,
                totalPages: 0
            };

            this.getPage = this.getPage.bind(this);
        }

        getFeed(promise) {
            this.setState({isReady: false});
            promise.then((feed) => {
                    this.setState({
                        feed: feed.articles,
                        isReady: true,
                        totalArticles: feed.articlesCount,
                        totalPages: Math.ceil(feed.articlesCount / this.PAGE_LIMIT)
                    });
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        return
                    }

                    console.error(error);
                    this.setState({isReady: false});
                });
        }

        componentDidMount() {
            const queryParams = Object.assign({}, this.defaultQueryParams, {limit: this.PAGE_LIMIT, offset: 0});
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        componentWillUnmount() {
            if (this.feedRequest) {
                this.feedRequest.abort();
            }
        }

        getPage(page) {
            this.setState({pageNumber: page});
            const queryParams = Object.assign(
                {},
                this.defaultQueryParams,
                {limit: this.PAGE_LIMIT, offset: (this.PAGE_LIMIT * page) - this.PAGE_LIMIT}
            );
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        paginate() {
            const pages = [];
            for (let i = 1; i <= this.state.totalPages; i += 1) {
                pages.push(<span key={i} onClick={() => {this.getPage(i)}}>{i}</span>);
            }
            return pages;
        }

        render() {
            return (
                <div>
                    {!this.state.isReady && <div>Loading articles...</div>}

                    {this.state.isReady && this.state.feed.length === 0 && <div>No articles are here... yet.</div>}

                    {this.state.isReady && this.state.feed.length > 0 &&
                        this.state.feed.map((article) => {
                            return (
                                <div key={article.createdAt}>
                                    <Link to={`/article/${article.slug}`}>{article.title}</Link>
                                </div>
                            )
                        })
                    }

                    {this.paginate()}
                </div>
            );
        }
    }
}

const GlobalFeed = feedFactory(articleService.getList, {});
const PersonalFeed = feedFactory(feed.getList, {});
const TagFeed = feedFactory(articleService.getList, {});


function withAuthenticatedUser(WrappedComponent) {
    return class AuthenticatedUserHoc extends Component {
        constructor(props) {
            super(props);

            this.state = {currentUser: {}};
            this.onCurrentUserChange = this.onCurrentUserChange.bind(this);
        }

        onCurrentUserChange(user) {
            this.setState({currentUser: user});
        }

        componentDidMount() {
            user.currentUser.subscribe(this.onCurrentUserChange);
        }

        componentWillUnmount() {
            user.currentUser.unsubscribe(this.onCurrentUserChange);
        }

        render() {
            return (
                <div>
                    <WrappedComponent {...this.props} currentUser={this.state.currentUser}/>
                </div>
            );
        }
    }
}

class CommentViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: true
        };

        this.remove = this.remove.bind(this);
    }

    remove() {
        this.setState({isReady: false});

        this.request = this.props.onRemove(this.props.comment.id);
        this.request.promise
            .catch((error) => {
                console.error(error);
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isReady: true});
            });
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div key={this.props.comment.id}>
                <div>{this.props.comment.author.username} on {this.props.comment.createdAt}</div>
                <div>{this.props.comment.body}</div>
                {
                    this.props.isAuthor &&
                    <button onClick={() => {this.remove(this.props.comment.id)}}>delete</button>
                }

                {!this.state.isReady && <div>removing...</div>}
            </div>
        );
    }
}

class CommentEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: ''
        };
        this.handleInput = this.handleInput.bind(this);
        this.postComment = this.postComment.bind(this);
        this.resetInput = this.resetInput.bind(this);
    }

    handleInput(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    resetInput() {
        this.setState({comment: ''});
    }

    postComment() {
        this.request = commentService.create(this.props.articleSlug, this.state.comment);
        this.request.promise
            .then(() => {
                this.resetInput();
                this.props.onPostSuccess();
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div>
                <span>{this.props.currentUser.username}: </span>
                <textarea
                    name="comment"
                    value={this.state.comment}
                    onChange={this.handleInput}></textarea>
                <button onClick={this.postComment}>Post comment</button>
                <hr/>
            </div>
        );
    }
}
const CommentEditorWithCurrentUser = withAuthenticatedUser(CommentEditor);

class CommentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            isReady: false
        };

        this.removeComment = this.removeComment.bind(this);
        this.isCommentAuthor = this.isCommentAuthor.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    getComments() {
        this.setState({isReady: false});

        this.request = commentService.getList(this.props.articleSlug);
        this.request.promise
            .then((response) => {
                this.setState({comments: response.comments, isReady: true});
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isReady: true});
            });
    }

    componentDidMount() {
        this.getComments();
    }

    componentWillUnmount() {
        this.request.abort();
    }

    removeComment(commentId) {
        this.request = commentService.remove(this.props.articleSlug, commentId);
        this.request.promise
            .then(this.getComments)
            .catch(console.error);
        return this.request;
    }

    isCommentAuthor(comment) {
        return commentService.isAuthor(this.props.currentUser, comment);
    }

    renderComments() {
        return <div>
            <CommentEditorWithCurrentUser articleSlug={this.props.articleSlug} onPostSuccess={this.getComments}/>
            {
                this.state.comments.map((comment) => {
                    return <CommentViewer
                        comment={comment}
                        onRemove={this.removeComment}
                        isAuthor={this.isCommentAuthor(comment)}
                        key={comment.id}/>
                })
            }
            </div>
    }

    renderLoader() {
        return <div>loading...</div>;
    }

    render() {
        return (
            <div>
                {this.state.isReady ? this.renderComments() : this.renderLoader()}
            </div>
        );
    }
}
const CommentListWithCurrentUser = withAuthenticatedUser(CommentList);

class TagList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: []
        };

        this.selectTag = this.selectTag.bind(this);
    }

    componentDidMount() {
        this.request = tagService.getList();
        this.request.promise
            .then((response) => {
                this.setState({tags: response.tags});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    selectTag(tag) {
        this.props.onSelect(tag);
    }

    render() {
        return (
            <div>
                Popular Tags
                <div>
                    {
                        this.state.tags.map(
                            tag => <span onClick={() => {this.selectTag(tag)}} key={tag}>{tag} |</span>
                        )
                    }
                </div>
            </div>
        );
    }
}

// if user is authenticated default is 'personal', if not then 'global'
const feedChoice = {
    GLOBAL: 'global',
    PERSONAL: 'personal',
    TAG: 'tag' // user selected a tag
};

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserAuthenticated: false,
            selectedFeed: feedChoice.GLOBAL
        };

        this.handleFeedChange = this.handleFeedChange.bind(this);
        this.onUserAuthentication = this.onUserAuthentication.bind(this);
        this.selectTag = this.selectTag.bind(this);
    }

    handleFeedChange(event) {
        this.setState({selectedFeed: event.target.value});
    }

    onUserAuthentication(isUserAuthenticated) {
        if (isUserAuthenticated) {
            this.setState({selectedFeed: feedChoice.PERSONAL});
        }
        this.setState({isUserAuthenticated: isUserAuthenticated});
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.onUserAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onUserAuthentication);
    }

    selectTag(tag) {
        this.setState({selectedFeed: feedChoice.TAG, tag: tag});
    }

    render() {
        return (
            <div>
                Home Page
                <TagList onSelect={this.selectTag}/>

                <select onChange={this.handleFeedChange} value={this.state.selectedFeed}>
                    <option value={feedChoice.GLOBAL}>Global Feed</option>
                    {this.state.isUserAuthenticated && <option value={feedChoice.PERSONAL}>Your Feed</option>}
                    {this.state.selectedFeed === feedChoice.TAG && <option value={feedChoice.TAG}>{this.state.tag}</option>}
                </select>

                {this.state.selectedFeed === feedChoice.GLOBAL && <GlobalFeed/>}
                {this.state.selectedFeed === feedChoice.PERSONAL && <PersonalFeed/>}
                {this.state.selectedFeed === feedChoice.TAG && <TagFeed key={this.state.tag} tag={this.state.tag}/>}
            </div>
        );
    }
}

class UserProfile extends Component {
    render() {
        return (
            <div>
                {this.props.match.params.user} Profile.
            </div>
        )
    }
}


class ArticleForm extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.state = {
            article: {
                title: this.props.title || '',
                description: this.props.description || '',
                body: this.props.body || '',
                tagList: (this.props.tagList && this.props.tagList.join()) || ''
            }
        };
    }

    onSubmit(event) {
        event.preventDefault();
        const tagList = this.state.article.tagList.length > 0 ? this.state.article.tagList.split(' ') : [];
        this.props.onSubmit({...this.state.article, tagList: tagList});
    }

    handleInput(event) {
        const article = {...this.state.article, [event.target.name]: event.target.value};
        this.setState({article: article});
    }

    render() {
        return (
            <form>
                <input
                    name="title"
                    type="text"
                    placeholder="Article Title"
                    value={this.state.article.title}
                    onChange={this.handleInput}/>

                <input
                    name="description"
                    type="text"
                    placeholder="Whats this article about?"
                    value={this.state.article.description}
                    onChange={this.handleInput}/>

                <textarea
                    name="body"
                    placeholder="Write your article (markdown)"
                    value={this.state.article.body}
                    onChange={this.handleInput}/>

                <input
                    name="tagList"
                    type="text"
                    placeholder="tags"
                    value={this.state.article.tagList}
                    onChange={this.handleInput}/>

                <button onClick={this.onSubmit}>Publish Article</button>
            </form>
        );
    }
}

class ArticleEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentDidMount() {
        this.articleRequest = articleService.get(this.props.match.params.slug);
        this.articleRequest.promise
            .then((article) => {
                this.setState({article: article.article});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        this.articleRequest.abort();
    }

    saveChanges(article) {
        console.log('articleService: ', article);
        this.articleRequest = articleService.update(this.state.article.slug, article);
        this.articleRequest.promise
            .then((response) => {
                this.props.history.push(`/article/${response.article.slug}`);
            })
            .catch(console.error);
    }

    render() {
        return (
            <Fragment>
                {this.state.article &&
                <ArticleForm
                    title={this.state.article.title}
                    body={this.state.article.body}
                    description={this.state.article.description}
                    tagList={this.state.article.tagList}
                    onSubmit={this.saveChanges}/>}
            </Fragment>
        )
    }
}
ArticleEditor = withRouter(ArticleEditor);


class ArticleCreator extends Component {
    constructor(props) {
        super(props);

        this.create = this.create.bind(this);
    }

    create(article) {
        this.request = articleService.create(article);
        this.request.promise
            .then((response) => {
                this.props.history.push(`/article/${response.article.slug}`);
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <ArticleForm onSubmit={this.create}/>
        );
    }
}
ArticleCreator = withRouter(ArticleCreator);


class ArticleViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };

        this.deleteArticle = this.deleteArticle.bind(this);
    }

    componentDidMount() {
        this.request = articleService.get(this.props.match.params.slug);
        this.request.promise
            .then((response) => {
                this.setState({article: response.article});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        this.request.abort();
    }

    deleteArticle() {
        this.request = articleService.remove(this.props.match.params.slug);
        this.request.promise
            .then(() => {
                this.props.history.push('/');
            })
            .catch(console.error);
    }

    render() {
        return (
            <div>
            {this.state.isReady && <div>Loading...</div>}

            {
                this.state.article &&
                <div>
                    <div>{this.state.article.title}</div>
                    <Link to={`/editor/${this.state.article.slug}`}>Edit Article</Link>
                    <button onClick={this.deleteArticle}>Delete Article</button>
                    <div>tags: {this.state.article.tagList.join(',')}</div>
                    <Link to={`/@${this.state.article.author.username}`}>{this.state.article.author.username}</Link>
                    <CommentListWithCurrentUser articleSlug={this.state.article.slug}/>
                </div>
            }
            </div>
        );
    }
}
ArticleViewer = withRouter(ArticleViewer);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };

        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    checkAuthentication(isAuthenticated) {
        this.setState({isAuthenticated: isAuthenticated});
        if (isAuthenticated) {
            user.getCurrentUser();
        }
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.checkAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.checkAuthentication);
    }

    render() {
        return (
            <Fragment>
                <Router>
                    <Fragment>
                        <Navigation/>
                        <Switch>
                            <Route path="/" exact component={HomePage}/>
                            <Route path="/register" component={Registration}/>
                            <Route path="/login" component={LogIn}/>
                            <Route path="/@:user" component={UserProfile}/>
                            <Route path="/editor/:slug" component={ArticleEditor}/>
                            <Route path="/editor" component={ArticleCreator}/>
                            <Route path="/article/:slug" component={ArticleViewer}/>
                        </Switch>
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}

export default App;
