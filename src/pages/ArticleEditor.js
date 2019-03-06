import {Component, Fragment} from "react";
import {articleResource} from "../api/article";
import React from "react";
import ArticleForm from "../components/ArticleForm";
import withAuthorizationCheck from "../hoc/withAuthorizationCheck";


class ArticleEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: {...this.props.resolved.article}
        };
        this.saveChanges = this.saveChanges.bind(this);
    }

    saveChanges(article) {
        this.articleRequest = articleResource.update(this.state.article.slug, article);
        this.articleRequest.promise
            .then((response) => {
                this.props.navigation.go(`/article/${response.article.slug}`);
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.articleRequest) {
            this.articleRequest.abort();
        }
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

function getArticle(match) {
    return articleResource.get(match.params.slug);
}

function hasPermission(currentUser, response) {
    return currentUser.username === response.article.author.username;
}

export default withAuthorizationCheck(ArticleEditor, getArticle, hasPermission);