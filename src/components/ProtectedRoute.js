import {Component, Fragment} from "react";
import {authenticationStatusEnum} from "../api/user";
import {Redirect, Route} from "react-router-dom";
import withAuthenticatedUser from "../hoc/withAuthenticatedUser";
import React from "react";


class ProtectedRoute extends Component {
    constructor(props) {
        super(props);

        this.isAuthenticatedUser = this.isAuthenticatedUser.bind(this);
        this.isAnonymousUser = this.isAnonymousUser.bind(this);
        this.isUserLoading = this.isUserLoading.bind(this);
    }

    isUserLoading() {
        return this.props.authenticationStatus === authenticationStatusEnum.IN_PROGRESS;
    }

    isAuthenticatedUser() {
        return this.props.authenticationStatus === authenticationStatusEnum.AUTHENTICATED;
    }

    isAnonymousUser() {
        return this.props.authenticationStatus === authenticationStatusEnum.NOT_AUTHENTICATED;
    }

    render() {
        const {component: Component, ...rest} = this.props;

        return (
            <Fragment>
                {
                    this.isUserLoading() &&
                    <span>Route is loading...</span>
                }

                <Route {...rest}
                   render={(props) => {
                       return <Fragment>
                           {
                               this.isAuthenticatedUser() &&
                               <Component {...props}/>
                           }

                           {
                               this.isAnonymousUser() &&
                               <Redirect to={{pathname: "/login", state:{from: props.location}}}/>
                           }
                       </Fragment>
                   }}/>
            </Fragment>
        );
    }
}
ProtectedRoute = withAuthenticatedUser(ProtectedRoute);

export default ProtectedRoute;