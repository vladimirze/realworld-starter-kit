import {Component} from "react";
import React from "react";
import {Link} from "react-router-dom";


export default class CommentViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: true
        };

        this.remove = this.remove.bind(this);
    }

    remove() {
        this.setState({isReady: false});

        this.request = this.props.onRemove(this.props.comment.id);
        this.request.promise
            .catch((error) => {
                console.error(error);
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isReady: true});
            });
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div className="card" key={this.props.comment.id}>
                <div className="card-block">
                    <p className="card-text">{this.props.comment.body}</p>
                </div>

                <div className="card-footer">
                    <Link to={`/@${this.props.comment.author.username}`} className="comment-author">
                        <img src={this.props.comment.author.image} className="comment-author-img"/>
                    </Link>
                    &nbsp;

                    <Link to={`/@${this.props.comment.author.username}`}
                          className="comment-author">{this.props.comment.author.username}
                    </Link>

                    {/* TODO: Date formatting */}
                    <span className="date-posted">{this.props.comment.createdAt}</span>
                </div>
            </div>
        );
    }
}