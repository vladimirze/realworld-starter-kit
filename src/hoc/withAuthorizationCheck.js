import {Component} from "react";
import React from "react";
import withAuthenticatedUser from "./withAuthenticatedUser";
import {ErrorViewer} from "../components/ErrorViewer";
import NotFound404 from "../components/NotFound404";
import withNavigation from "./withNavigation";



const withAuthorizationCheck = (WrappedComponent, resolveFn, hasPermissionFn) => {
    class AuthorizedOnly extends Component {
        constructor(props) {
            super(props);

            this.state = {
                isAuthorized: false,
                isReady: false,
                isErrorHappened: false,
                resolved: {},
                isNotFoundError: false
            }
        }

        componentDidMount() {
            this.request = resolveFn(this.props.match);
            this.request.promise
                .then((response) => {
                    this.setState({
                        isAuthorized: hasPermissionFn(this.props.currentUser, response),
                        isReady: true,
                        resolved: response
                    })
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        return;
                    } else if (error.statusCode === 404) {
                        this.setState({isNotFoundError: true});
                    } else {
                        this.setState({isErrorHappened: true, error: error});
                    }
                })
        }

        componentWillUnmount() {
            if (this.request) {
                this.request.abort();
            }
        }

        render() {
            return (
                <NotFound404 isShown={this.state.isNotFoundError}>
                    {/*Authorized*/}
                    {this.state.isReady && this.state.isAuthorized &&
                        <WrappedComponent {...this.props} resolved={this.state.resolved}/>
                    }

                    {/*Not authorized*/}
                    {this.state.isReady && !this.state.isAuthorized &&
                        <div className="container page">
                            <div className="row">
                                <div className="col-md-10 offset-md-1 col-xs-12">
                                    <div className="alert alert-warning" role="alert">
                                        Not Authorized
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {/*Unable to retrieve the data*/}
                    {this.state.isReady && this.state.isErrorHappened &&
                        <div className="container page">
                            <div className="row">
                                <div className="col-md-10 offset-md-1 col-xs-12">
                                    An error occurred:
                                    <div className="alert alert-danger" role="alert">
                                        <ErrorViewer errors={this.state.errors}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </NotFound404>
            );
        }
    }

    return withNavigation(withAuthenticatedUser(AuthorizedOnly))
};

export default withAuthorizationCheck;