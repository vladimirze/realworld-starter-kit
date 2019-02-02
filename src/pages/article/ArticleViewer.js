import {Component, Fragment} from "react";
import {articleResource} from "../../resources/article";
import {Link, withRouter} from "react-router-dom";
import marked from "marked";
import withAuthenticatedUser from "../../components/withAuthenticatedUser";
import React from "react";
import CommentList from "../../components/CommentList";


class ArticleViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };

        this.deleteArticle = this.deleteArticle.bind(this);
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

                            <div className="article-meta">
                                <Link to={`/@${this.state.article.author.username}`}>
                                    <img src={this.state.article.author.image}/>
                                </Link>

                                <div className="info">
                                    <Link to={`/@${this.state.article.author.username}`} className="author">
                                        Eric Simons
                                    </Link>
                                    {/* TODO: date formatting */}
                                    <span className="date">{this.state.article.createdAt}</span>
                                </div>

                                {/* TODO: Follow button */}
                                <button className="btn btn-sm btn-outline-secondary">
                                    <i className="ion-plus-round"></i>
                                    &nbsp;
                                    Follow Eric Simons <span className="counter">(10)</span>
                                </button>

                                {/* TODO: Favorite button */}
                                &nbsp;&nbsp;
                                <button className="btn btn-sm btn-outline-primary">
                                    <i className="ion-heart"></i>
                                    &nbsp;
                                    Favorite Post <span className="counter">(29)</span>
                                </button>
                            </div>

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
                            {/* TODO: article meta (same as above) */}
                            <div className="article-meta">
                                <Link to={`/@${this.state.article.author.username}`}>
                                    <img src={this.state.article.author.image}/>
                                </Link>

                                <div className="info">
                                    <Link to={`/@${this.state.article.author.username}`} className="author">
                                        Eric Simons
                                    </Link>
                                    {/* TODO: date formatting */}
                                    <span className="date">{this.state.article.createdAt}</span>
                                </div>

                                {/* TODO: Follow button */}
                                <button className="btn btn-sm btn-outline-secondary">
                                    <i className="ion-plus-round"></i>
                                    &nbsp;
                                    Follow Eric Simons <span className="counter">(10)</span>
                                </button>

                                {/* TODO: Favorite button */}
                                &nbsp;&nbsp;
                                <button className="btn btn-sm btn-outline-primary">
                                    <i className="ion-heart"></i>
                                    &nbsp;
                                    Favorite Post <span className="counter">(29)</span>
                                </button>
                            </div>
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