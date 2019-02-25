import {Component, Fragment} from "react";
import {articleResource} from "../resources/article";
import React from "react";
import ArticleForm from "../components/ArticleForm";
import withAuthorizationCheck from "../components/withAuthorizationCheck";


class ArticleEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: {...this.props.resolved.article}
        };
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentWillUnmount() {
        if (this.articleRequest) {
            this.articleRequest.abort();
        }
    }

    saveChanges(article) {
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

function getArticle(match) {
    return articleResource.get(match.params.slug);
}

function hasPermission(currentUser, response) {
    return currentUser.username === response.article.author.username;
}

export default withAuthorizationCheck(ArticleEditor, getArticle, hasPermission);