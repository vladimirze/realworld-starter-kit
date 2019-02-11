import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {date} from '../services/representator';


const ArticleAuthor = (props) => {
    return (
            <Fragment>
                <Link to={`/@${props.article.author.username}`}>
                    <img src={props.article.author.image} alt={props.article.author.username}/>
                </Link>

                <div className="info">
                    <Link to={`/@${props.article.author.username}`} className="author">
                        {props.article.author.username}
                    </Link>
                    <span className="date">{date.format(props.article.createdAt)}</span>
                </div>
            </Fragment>
        );
};

export default ArticleAuthor;