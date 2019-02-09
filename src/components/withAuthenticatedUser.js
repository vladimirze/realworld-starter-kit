import {Component} from "react";
import user from "../resources/user";
import React from "react";


export default function withAuthenticatedUser(WrappedComponent) {
    return class AuthenticatedUserHoc extends Component {
        constructor(props) {
            super(props);

            this.state = {
                currentUser: {},
                isAuthenticated: false
            };

            this.onCurrentUserChange = this.onCurrentUserChange.bind(this);
            this.onAuthentication = this.onAuthentication.bind(this);
        }

        onCurrentUserChange(user) {
            this.setState({currentUser: user});
        }

        onAuthentication(isAuthenticated) {
            this.setState({isAuthenticated: isAuthenticated});
        }

        componentDidMount() {
            user.currentUser.subscribe(this.onCurrentUserChange);
            user.isAuthenticated.subscribe(this.onAuthentication);
        }

        componentWillUnmount() {
            user.currentUser.unsubscribe(this.onCurrentUserChange);
            user.isAuthenticated.unsubscribe(this.onAuthentication);
        }

        render() {
            return (
                <div>
                    <WrappedComponent {...this.props}
                                      currentUser={this.state.currentUser}
                                      isUserAuthenticated={this.state.isAuthenticated}/>
                </div>
            );
        }
    }
}