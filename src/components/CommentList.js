import {Component} from "react";
import {commentResource} from "../resources/comment";
import withAuthenticatedUser from "./withAuthenticatedUser";
import React from "react";
import CommentEditor from "./CommentEditor";
import CommentViewer from "./CommentViewer";


class CommentList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            isReady: false
        };

        this.removeComment = this.removeComment.bind(this);
        this.isCommentAuthor = this.isCommentAuthor.bind(this);
        this.getComments = this.getComments.bind(this);
    }

    getComments() {
        this.setState({isReady: false});

        this.request = commentResource.getList(this.props.articleSlug);
        this.request.promise
            .then((response) => {
                this.setState({comments: response.comments, isReady: true});
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isReady: true});
            });
    }

    componentDidMount() {
        this.getComments();
    }

    componentWillUnmount() {
        this.request.abort();
    }

    removeComment(commentId) {
        this.request = commentResource.remove(this.props.articleSlug, commentId);
        this.request.promise
            .then(this.getComments)
            .catch(console.error);
        return this.request;
    }

    isCommentAuthor(comment) {
        return commentResource.isAuthor(this.props.currentUser, comment);
    }

    renderComments() {
        return <div>
            <CommentEditor articleSlug={this.props.articleSlug} onPostSuccess={this.getComments}/>
            {
                this.state.comments.map((comment) => {
                    return <CommentViewer comment={comment}
                                          onRemove={this.removeComment}
                                          isAuthor={this.isCommentAuthor(comment)}
                                          key={comment.id}/>
                })
            }
            </div>
    }

    renderLoader() {
        return <div>loading...</div>;
    }

    render() {
        return (
            <div>
                {this.state.isReady ? this.renderComments() : this.renderLoader()}
            </div>
        );
    }
}

export default withAuthenticatedUser(CommentList);
