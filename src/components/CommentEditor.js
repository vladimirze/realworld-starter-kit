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

    postComment(event) {
        event.preventDefault();

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
            <form className="card comment-form">
                <div className="card-block">
                    <textarea className="form-control"
                              placeholder="Write a comment..."
                              rows="3"
                              value={this.state.comment}
                              name="comment"
                              onChange={this.handleInput}></textarea>
                </div>

                <div className="card-footer">
                    {/* TODO: comment author image */}
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img"/>

                    <button className="btn btn-sm btn-primary" onClick={this.postComment}>
                        Post Comment
                    </button>
                </div>
            </form>
        );
    }
}

export default withAuthenticatedUser(CommentEditor);