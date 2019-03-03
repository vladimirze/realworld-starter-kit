import {Component} from "react";
import user, {authenticationStatusEnum} from "../api/user";
import React from "react";


export default function withAuthenticatedUser(WrappedComponent) {
    return class AuthenticatedUserHoc extends Component {
        constructor(props) {
            super(props);

            this.state = {
                currentUser: {},
                authenticationStatus: authenticationStatusEnum.IN_PROGRESS
            };

            this.onCurrentUserChange = this.onCurrentUserChange.bind(this);
            this.onAuthentication = this.onAuthentication.bind(this);
        }

        onCurrentUserChange(user) {
            this.setState({currentUser: user});
        }

        onAuthentication(authenticationStatus) {
            this.setState({authenticationStatus: authenticationStatus});
        }

        componentDidMount() {
            user.currentUser.subscribe(this.onCurrentUserChange);
            user.authenticationStatus.subscribe(this.onAuthentication);
        }

        componentWillUnmount() {
            user.currentUser.unsubscribe(this.onCurrentUserChange);
            user.authenticationStatus.unsubscribe(this.onAuthentication);
        }

        render() {
            return (
                <WrappedComponent {...this.props}
                                  currentUser={this.state.currentUser}
                                  authenticationStatus={this.state.authenticationStatus}/>
            );
        }
    }
}