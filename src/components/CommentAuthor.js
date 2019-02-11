import React, {Fragment} from 'react';
import {Link} from "react-router-dom";

import config from '../config';


const CommentAuthor = (props) => {
    return (
        <Fragment>
            <Link to={`/@${props.author.username}`} className="comment-author">
                <img src={props.author.image || config.DEFAULT_USER_IMAGE}
                     className="comment-author-img"
                     alt={`${props.author.username}`}/>
            </Link>
            &nbsp;

            <Link to={`/@${props.author.username}`}
                  className="comment-author">{props.author.username}
            </Link>
        </Fragment>
    )
};

export default CommentAuthor;