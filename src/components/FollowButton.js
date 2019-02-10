import React, {Component} from 'react';
import {profileResource} from "../resources/profile";
import withAuthenticatedUser from "./withAuthenticatedUser";


export class FollowButton extends Component {
    constructor(props) {
        super(props);

        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick() {
        if (this.props.isFollowing) {
            this.props.onUnfollow();
        } else {
            this.props.onFollow();
        }
    }

    render() {
        const buttonStyle = this.props.isFollowing ? 'btn-secondary' : 'btn-outline-secondary';

        return (
            <button className={`btn btn-sm ${buttonStyle} ${this.props.className}`}
                    onClick={this.onButtonClick}
                    disabled={this.props.isDisabled}>
                <i className="ion-plus-round"></i>
                &nbsp;
                {this.props.isFollowing ? 'Unfollow' : 'Follow'} {this.props.subject}
            </button>
        );
    }
}

class FollowUserButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false
        };

        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }

    follow() {
        this.makeRequest(profileResource.follow, this.props.onFollow);
    }

    unfollow() {
        this.makeRequest(profileResource.unfollow, this.props.onUnfollow);
    }

    makeRequest(requestFn, callbackFn) {
        this.setState({isBusy: true});
        this.request = requestFn(this.props.profile.username);

        this.request.promise
            .then(() => {
                this.setState({isBusy: false});
                callbackFn();
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }

                this.setState({isBusy: false});
            });
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <FollowButton isFollowing={this.props.profile.following}
                          onUnfollow={this.unfollow}
                          onFollow={this.follow}
                          subject={this.props.profile.username}
                          isDisabled={!this.props.isUserAuthenticated}/>
        );
    }
}

FollowUserButton = withAuthenticatedUser(FollowUserButton);

export { FollowUserButton };