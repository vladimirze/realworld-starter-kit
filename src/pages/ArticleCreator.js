import {Component} from "react";
import {articleResource} from "../resources/article";
import {withRouter} from "react-router-dom";
import React from "react";
import ArticleForm from "../components/ArticleForm";


class ArticleCreator extends Component {
    constructor(props) {
        super(props);

        this.create = this.create.bind(this);
    }

    create(article) {
        this.request = articleResource.create(article);
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

export default withRouter(ArticleCreator);