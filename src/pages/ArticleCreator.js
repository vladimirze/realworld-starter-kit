import {Component} from "react";
import {articleResource} from "../api/article";
import React from "react";
import ArticleForm from "../components/ArticleForm";
import withNavigation from "../hoc/withNavigation";


class ArticleCreator extends Component {
    constructor(props) {
        super(props);

        this.create = this.create.bind(this);
    }

    create(article) {
        this.request = articleResource.create(article);
        this.request.promise
            .then((response) => {
                this.props.navigation.go(`/article/${response.article.slug}`)
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

export default withNavigation(ArticleCreator);