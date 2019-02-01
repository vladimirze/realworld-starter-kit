import {Component} from "react";
import {commentResource} from "../resources/comment";
import withAuthenticatedUser from "./withAuthenticatedUser";
import React from "react";


class CommentEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: ''
        };
        this.handleInput = this.handleInput.bind(this);
        this.postComment = this.postComment.bind(this);
        this.resetInput = this.resetInput.bind(this);
    }

    handleInput(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    resetInput() {
        this.setState({comment: ''});
    }

    postComment() {
        this.request = commentResource.create(this.props.articleSlug, this.state.comment);
        this.request.promise
            .then(() => {
                this.resetInput();
                this.props.onPostSuccess();
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div>
                <span>{this.props.currentUser.username}: </span>
                <textarea
                    name="comment"
                    value={this.state.comment}
                    onChange={this.handleInput}></textarea>
                <button onClick={this.postComment}>Post comment</button>
                <hr/>
            </div>
        );
    }
}

export default withAuthenticatedUser(CommentEditor);