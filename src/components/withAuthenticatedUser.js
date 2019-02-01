import {Component} from "react";
import user from "../resources/user";
import React from "react";


export default function withAuthenticatedUser(WrappedComponent) {
    return class AuthenticatedUserHoc extends Component {
        constructor(props) {
            super(props);

            this.state = {currentUser: {}};
            this.onCurrentUserChange = this.onCurrentUserChange.bind(this);
        }

        onCurrentUserChange(user) {
            this.setState({currentUser: user});
        }

        componentDidMount() {
            user.currentUser.subscribe(this.onCurrentUserChange);
        }

        componentWillUnmount() {
            user.currentUser.unsubscribe(this.onCurrentUserChange);
        }

        render() {
            return (
                <div>
                    <WrappedComponent {...this.props} currentUser={this.state.currentUser}/>
                </div>
            );
        }
    }
}