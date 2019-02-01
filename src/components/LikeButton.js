import {Component} from "react";
import React from "react";


export default class LikeButton extends Component {
    constructor(props) {
        super(props);

        this.unfavorite = this.unfavorite.bind(this);
        this.favorite = this.favorite.bind(this);
    }

    unfavorite() {
        this.props.onUnfavorite(this.props.articleSlug);
    }

    favorite() {
        this.props.onFavorite(this.props.articleSlug);
    }

    render() {
        return (
            <div>
                ({this.props.count})
                {
                    this.props.isFavorited ?
                        <button onClick={this.unfavorite}>Unfavorite</button> :
                        <button onClick={this.favorite}>Favorite</button>
                }
            </div>
        );
    }
}