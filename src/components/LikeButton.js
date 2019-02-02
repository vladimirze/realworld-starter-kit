import {Component} from "react";
import React from "react";


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