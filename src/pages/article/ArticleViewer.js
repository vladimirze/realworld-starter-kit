import {Component} from "react";
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
            <div>
            {this.state.isReady && <div>Loading...</div>}

            {
                this.state.article &&
                <div>
                    <div>{this.state.article.title}</div>
                    {this.isAuthor() && <Link to={`/editor/${this.state.article.slug}`}>Edit Article</Link>}
                    {this.isAuthor() && <button onClick={this.deleteArticle}>Delete Article</button>}
                    <div dangerouslySetInnerHTML={{__html: marked(this.state.article.body, {sanitize: true})}}></div>
                    <div>tags: {this.state.article.tagList.join(',')}</div>
                    <Link to={`/@${this.state.article.author.username}`}>{this.state.article.author.username}</Link>
                    <CommentList articleSlug={this.state.article.slug}/>
                </div>
            }
            </div>
        );
    }
}

export default withAuthenticatedUser(withRouter(ArticleViewer));