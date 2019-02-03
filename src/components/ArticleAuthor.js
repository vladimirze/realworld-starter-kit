import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";


export default class ArticleAuthor extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Fragment>
                <Link to={`/@${this.props.article.author.username}`}>
                    <img src={this.props.article.author.image}/>
                </Link>

                <div className="info">
                    <Link to={`/@${this.props.article.author.username}`} className="author">
                        {this.props.article.author.username}
                    </Link>
                    {/* TODO: date formatting */}
                    <span className="date">{this.props.article.createdAt}</span>
                </div>
            </Fragment>
        );
    }
}