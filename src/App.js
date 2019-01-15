import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {addRequestInterceptor, addResponseInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";
import {articleService} from './article';
import {feed} from "./feed";

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
function feedFactory(dataSource, pageLimit=10) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.pageLimit = pageLimit;
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
                        totalPages: Math.ceil(feed.articlesCount / this.pageLimit)
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
            this.feedRequest = dataSource();
            this.getFeed(this.feedRequest.promise);
        }

        componentWillUnmount() {
            if (this.feedRequest) {
                this.feedRequest.abort();
            }
        }

        getPage(page) {
            this.setState({pageNumber: page});
            this.feedRequest = dataSource(this.pageLimit, (this.pageLimit * page) - this.pageLimit);
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
                            return <div key={article.createdAt}>{article.title}</div>
                        })
                    }

                    {this.paginate()}
                </div>
            );
        }
    }
}

const GlobalFeed = feedFactory(articleService.getList);
const PersonalFeed = feedFactory(feed.getList);


// if user is authenticated default is 'personal', if not then 'global'
const feedChoice = {
    GLOBAL: 'global',
    PERSONAL: 'personal'
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

    render() {
        return (
            <div>
                Home Page
                <select onChange={this.handleFeedChange} value={this.state.selectedFeed}>
                    <option value={feedChoice.GLOBAL}>Global Feed</option>
                    {this.state.isUserAuthenticated && <option value={feedChoice.PERSONAL}>Your Feed</option>}
                </select>

                {this.state.selectedFeed === feedChoice.GLOBAL && <GlobalFeed/>}
                {this.state.selectedFeed === feedChoice.PERSONAL && <PersonalFeed/>}
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
                        </Switch>
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}

export default App;
