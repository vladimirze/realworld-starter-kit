import {Component, Fragment} from "react";
import {articleResource} from "../../resources/article";
import {Link, withRouter} from "react-router-dom";
import marked from "marked";
import withAuthenticatedUser from "../../components/withAuthenticatedUser";
import React from "react";
import CommentList from "../../components/CommentList";
import {ArticleLikeButton} from "../../components/LikeButton";
import {FollowUserButton} from "../../components/FollowButton";
import ArticleAuthor from "../../components/ArticleAuthor";


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
                this.props.history.push('/');
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

const ArticleMeta = withRouter(BaseArticleMeta);


class ArticleViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };

        this.updateArticle = this.updateArticle.bind(this);
    }

    componentDidMount() {
        this.request = articleResource.get(this.props.match.params.slug);
        this.request.promise
            .then((response) => {
                this.setState({article: response.article});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        this.request.abort();
    }

    updateArticle(article) {
        this.setState({article: article});
    }

    render() {
        return (
            <Fragment>
            {this.state.isReady && <div>Loading...</div>}

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

                        <hr/>

                        <div className="article-actions">
                            <ArticleMeta article={this.state.article}
                                         onArticleChange={this.updateArticle}
                                         currentUser={this.props.currentUser}/>
                        </div>

                        <div className="row">
                            <div className="col-xs-12 col-md-8 offset-md-2">
                                <CommentList articleSlug={this.state.article.slug}/>
                            </div>
                        </div>

                    </div>

                </div>
            }
            </Fragment>
        );
    }
}

export default withAuthenticatedUser(withRouter(ArticleViewer));