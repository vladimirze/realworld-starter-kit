import {Component, Fragment} from "react";
import {articleResource} from "../../resources/article";
import {withRouter} from "react-router-dom";
import React from "react";
import ArticleForm from "../../components/ArticleForm";


class ArticleEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentDidMount() {
        this.articleRequest = articleResource.get(this.props.match.params.slug);
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
        console.log('articleResource: ', article);
        this.articleRequest = articleResource.update(this.state.article.slug, article);
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

export default withRouter(ArticleEditor);