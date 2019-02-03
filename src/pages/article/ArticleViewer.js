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


class ArticleMeta extends Component {
    render() {
        return (
            <div className="article-meta">
                <ArticleAuthor article={this.props.article}/>

                <FollowUserButton className="action-btn"
                                  profile={this.props.article.author}
                                  onFollow={this.props.onFollow}
                                  onUnfollow={this.props.onUnfollow}/>

                &nbsp;&nbsp;
                <ArticleLikeButton
                    className="btn-sm"
                    articleSlug={this.props.article.slug}
                    count={this.props.article.favoritesCount}
                    isFavorited={this.props.article.favorited}
                    onFavorite={this.props.onFavorite}
                    onUnfavorite={this.props.onUnfavorite}>
                </ArticleLikeButton>
            </div>
        );
    }
}

class ArticleViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };

        this.deleteArticle = this.deleteArticle.bind(this);
        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
        this.handleFollowClick = this.handleFollowClick.bind(this);
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

    deleteArticle() {
        this.request = articleResource.remove(this.props.match.params.slug);
        this.request.promise
            .then(() => {
                this.props.history.push('/');
            })
            .catch(console.error);
    }

    isAuthor() {
        return articleResource.isAuthor(this.state.article, this.props.currentUser);
    }

    favorite() {
        this.setState({article: Object.assign({}, this.state.article, {favorited: true})});
    }

    unfavorite() {
        this.setState({article: Object.assign({}, this.state.article, {favorited: false})});
    }

    handleFollowClick(isFollowing) {
        const author = Object.assign({}, this.state.article.author, {following: isFollowing});
        const article = Object.assign({}, this.state.article);
        article.author = author;

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
                                         onFollow={() => {this.handleFollowClick(true);}}
                                         onUnfollow={() => {this.handleFollowClick(false);}}
                                         onFavorite={this.favorite}
                                         onUnfavorite={this.unfavorite}/>
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
                                 onFollow={() => {this.handleFollowClick(true);}}
                                 onUnfollow={() => {this.handleFollowClick(false);}}
                                 onFavorite={this.favorite}
                                 onUnfavorite={this.unfavorite}/>
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