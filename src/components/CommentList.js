import {Component} from "react";
import {commentResource} from "../api/comment";
import withAuthenticatedUser from "../hoc/withAuthenticatedUser";
import React from "react";
import CommentEditor from "./CommentEditor";
import CommentViewer from "./CommentViewer";
import {authenticationStatusEnum} from "../api/user";


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

    componentDidMount() {
        this.getComments();
    }

    componentWillUnmount() {
        this.request.abort();
    }

    render() {
        return (
            <div>
                {
                    !this.state.isReady &&
                    <div>loading...</div>
                }


                {
                    this.state.isReady && (this.props.authenticationStatus === authenticationStatusEnum.AUTHENTICATED) &&
                    <CommentEditor
                        articleSlug={this.props.articleSlug}
                        onPostSuccess={this.getComments}
                        author={this.props.currentUser}/>
                }

                {
                    this.state.isReady &&
                    this.state.comments.map((comment) => {
                        return <CommentViewer comment={comment}
                                              onRemove={this.removeComment}
                                              isAuthor={this.isCommentAuthor(comment)}
                                              key={comment.id}/>
                        })
                }
            </div>
        );
    }
}

export default withAuthenticatedUser(CommentList);
