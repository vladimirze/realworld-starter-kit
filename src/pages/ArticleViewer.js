import {Component} from "react";
import {articleResource} from "../api/article";
import {Link} from "react-router-dom";
import marked from "marked";
import withAuthenticatedUser from "../hoc/withAuthenticatedUser";
import React from "react";
import CommentList from "../components/CommentList";
import {ArticleLikeButton} from "../components/LikeButton";
import {FollowUserButton} from "../components/FollowButton";
import ArticleAuthor from "../components/ArticleAuthor";
import {ArticleTags} from "../components/TagList";
import NotFound404 from "../components/NotFound404";
import withNavigation from "../hoc/withNavigation";
import {authenticationStatusEnum} from "../api/user";


class BaseArticleMeta extends Component {
    constructor(props) {
        super(props);

        this.handleFollowClick = this.handleFollowClick.bind(this);
        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.isAuthor = this.isAuthor.bind(this);
    }

    // change the favorite counter in place instead of re-fetching the article
    favorite() {
        const updatedArticle = Object.assign(
            {},
            this.props.article,
            {favorited: true, favoritesCount: this.props.article.favoritesCount + 1}
        );

        this.props.onArticleChange(updatedArticle);
    }

    unfavorite() {
        const updatedArticle = Object.assign(
            {},
            this.props.article,
            {favorited: false, favoritesCount: this.props.article.favoritesCount - 1}
        );

        this.props.onArticleChange(updatedArticle);
    }

    handleFollowClick(isFollowing) {
        const author = Object.assign({}, this.props.article.author, {following: isFollowing});
        const updatedArticle = Object.assign({}, this.props.article);
        updatedArticle.author = author;

        this.props.onArticleChange(updatedArticle);
    }

    deleteArticle() {
        this.request = articleResource.remove(this.props.match.params.slug);
        this.request.promise
            .then(() => {
                this.props.navigation.go('/')
            })
            .catch(console.error);
    }

    isAuthor() {
        return articleResource.isAuthor(this.props.article, this.props.currentUser);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div className="article-meta">
                <ArticleAuthor article={this.props.article}/>

                {
                    this.isAuthor() &&
                    <Link to={`/editor/${this.props.article.slug}`} className="btn btn-sm btn-outline-secondary">
                        <i className="ion-edit"></i> Edit Article
                    </Link>
                }

                &nbsp;&nbsp;
                {
                    this.isAuthor() &&
                    <button onClick={this.deleteArticle} className="btn btn-sm btn-outline-danger">
                        <i className="ion-trash-a"></i> Delete Article
                    </button>
                }

                {
                    !this.isAuthor() &&
                    <FollowUserButton className="action-btn"
                                      profile={this.props.article.author}
                                      onFollow={() => {this.handleFollowClick(true);}}
                                      onUnfollow={() => {this.handleFollowClick(false);}}/>
                }

                &nbsp;&nbsp;
                {
                    !this.isAuthor() &&
                    <ArticleLikeButton
                        className="btn-sm"
                        articleSlug={this.props.article.slug}
                        count={this.props.article.favoritesCount}
                        isFavorited={this.props.article.favorited}
                        onFavorite={this.favorite}
                        onUnfavorite={this.unfavorite}>
                    </ArticleLikeButton>
                }
            </div>
        );
    }
}

const ArticleMeta = withNavigation(BaseArticleMeta);


class ArticleViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            isArticleNotFound: false
        };

        this.updateArticle = this.updateArticle.bind(this);
    }

    componentDidMount() {
        this.request = articleResource.get(this.props.match.params.slug);
        this.request.promise
            .then((response) => {
                this.setState({article: response.article, isReady: true});
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                } else if (error.statusCode === 404) {
                    this.setState({isArticleNotFound: true});
                }

                console.error(error);
            });
    }

    componentWillUnmount() {
        this.request.abort();
    }

    updateArticle(article) {
        this.setState({article: article});
    }

    render() {
        return (
            <NotFound404 isShown={this.state.isArticleNotFound}>
                {!this.state.isReady && <div>Loading...</div>}

                {
                    this.state.article &&
                    <div className="article-page">

                        <div className="banner">
                            <div className="container">

                                <h1>{this.state.article.title}</h1>

                                <ArticleMeta article={this.state.article}
                                             onArticleChange={this.updateArticle}
                                             currentUser={this.props.currentUser}/>
                            </div>
                        </div>

                        <div className="container page">

                            <div className="row article-content">
                                <div className="col-md-12">
                                    <p dangerouslySetInnerHTML={{__html: marked(this.state.article.body, {sanitize: true})}}></p>
                                </div>
                            </div>

                            <ArticleTags tags={this.state.article.tagList}/>

                            <hr/>

                            <div className="article-actions">
                                <ArticleMeta article={this.state.article}
                                             onArticleChange={this.updateArticle}
                                             currentUser={this.props.currentUser}/>
                            </div>

                            {
                                (this.props.authenticationStatus !== authenticationStatusEnum.AUTHENTICATED) &&
                                <div className="row">
                                    <div className="col-xs-12 col-md-8 offset-md-2">
                                        <p>
                                            <Link to={{pathname: '/login', state: {from: this.props.location}}}>
                                                Sign in
                                            </Link>

                                            &nbsp; or &nbsp;

                                            <Link to={{pathname: '/register', state: {from: this.props.location}}}>
                                                sign up
                                            </Link> to add comments on this article.
                                        </p>
                                    </div>
                                </div>
                            }

                            <div className="row">
                                <div className="col-xs-12 col-md-8 offset-md-2">
                                    <CommentList articleSlug={this.state.article.slug}/>
                                </div>
                            </div>

                        </div>

                    </div>
                }
            </NotFound404>
        );
    }
}

export default withNavigation(withAuthenticatedUser(ArticleViewer));