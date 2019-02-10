import {Component} from "react";
import React from "react";
import CommentAuthor from "./CommentAuthor";
import {date} from '../services/representator';


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
                    <CommentAuthor author={this.props.comment.author}/>

                    <span className="date-posted">{date.format(this.props.comment.createdAt)}</span>

                    {
                        this.props.isAuthor &&
                        <span className="mod-options">
                            <i className="ion-trash-a" onClick={this.remove}></i>
                        </span>
                    }
                </div>
            </div>
        );
    }
}