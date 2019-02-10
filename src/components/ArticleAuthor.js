import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";
import {date} from '../services/representator';


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
                    <span className="date">{date.format(this.props.article.createdAt)}</span>
                </div>
            </Fragment>
        );
    }
}