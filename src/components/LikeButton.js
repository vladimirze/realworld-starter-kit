import {Component} from "react";
import React from "react";
import {articleResource} from "../resources/article";


export default class LikeButton extends Component {
    constructor(props) {
        super(props);

        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick() {
        if (this.props.isFavorited) {
            this.props.onUnfavorite(this.props.articleSlug);
        } else {
            this.props.onFavorite(this.props.articleSlug);
        }
    }

    render() {
        return (
            <button
                className={`btn ${this.props.className} ${this.props.isFavorited ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={this.onButtonClick}>
                <i className="ion-heart"></i> {this.props.count}
            </button>
        );
    }
}

export class ArticleLikeButton extends Component {
    constructor(props) {
        super(props);

        this.favorite = this.favorite.bind(this);
        this.unfavorite = this.unfavorite.bind(this);
    }

    favorite(articleSlug) {
        this.favoriteRequest = articleResource.favorite(articleSlug);
        this.favoriteRequest.promise.then(this.props.onFavorite)
            .catch(console.error);
    }

    unfavorite(articleSlug) {
        this.unfavoriteRequest = articleResource.unfavorite(articleSlug);
        this.unfavoriteRequest.promise.then(this.props.onUnfavorite)
            .catch(console.error);
    }

    componentWillUnmount() {
        [this.favoriteRequest, this.unfavoriteRequest].forEach((request) => {
            if (request) {
                request.abort();
            }
        });
    }

    render() {
        return (
            <LikeButton {...this.props} onFavorite={this.favorite} onUnfavorite={this.unfavorite}/>
        );
    }
}
