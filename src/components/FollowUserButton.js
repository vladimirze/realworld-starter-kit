import React, {Component} from 'react';
import {profileResource} from "../resources/profile";


export default class FollowUserButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false
        };

        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick() {
        this.setState({isBusy: true});

        let promise;
        if (this.props.profile.following) {
            this.unfollowRequest = profileResource.unfollow(this.props.profile.username);
            promise = this.unfollowRequest.promise;
        } else {
            this.followRequest = profileResource.follow(this.props.profile.username);
            promise = this.followRequest.promise;
        }

        promise
            .then(() => {
                this.setState({isBusy: false});
                this.props.onSuccess();
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isBusy: false});
            });
    }

    componentWillUnmount() {
        [this.unfollowRequest, this.followRequest].forEach((request) => {
            if (request) {
                request.abort();
            }
        });
    }

    render() {
        const buttonStyle = this.props.profile.following ? 'btn-secondary' : 'btn-outline-secondary';
        return (
            <button className={`btn btn-sm ${buttonStyle} ${this.props.className}`} onClick={this.onButtonClick}>
                <i className="ion-plus-round"></i>
                &nbsp;
                {this.props.profile.following ? 'Unfollow' : 'Follow'} {this.props.profile.username}
            </button>
        );
    }
}