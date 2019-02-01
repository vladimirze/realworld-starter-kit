import {Component} from "react";
import React from "react";


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
            <div key={this.props.comment.id}>
                <div>{this.props.comment.author.username} on {this.props.comment.createdAt}</div>
                <div>{this.props.comment.body}</div>
                {
                    this.props.isAuthor &&
                    <button onClick={() => {this.remove(this.props.comment.id)}}>delete</button>
                }

                {!this.state.isReady && <div>removing...</div>}
            </div>
        );
    }
}