import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";

import user from '../api/user';
import {ErrorViewer} from "../components/ErrorViewer";


class LogIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isBusy: false,
            errors: {}
        };

        this.logIn = this.logIn.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    logIn(event) {
        event.preventDefault();

        this.setState({isBusy: true});
        this.loginRequest = user.logIn(this.state.email, this.state.password);
        this.loginRequest.promise
            .then(() => {
                if (this.props.location.state && this.props.location.state.from) {
                    this.props.history.push(this.props.location.state.from);
                } else {
                    this.props.history.push('/');
                }
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    return;
                }
                console.error(error);
                this.setState({isBusy: false, errors: error.response.errors});
            });
    }

    componentWillUnmount() {
        if (this.loginRequest) {
            this.loginRequest.abort();
        }
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div className="auth-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Sign in</h1>
                            <p className="text-xs-center">
                                <Link to="/register">Need an account?</Link>
                            </p>

                            <form>
                                <ErrorViewer errors={this.state.errors}/>

                                <fieldset className="form-group">
                                    <input className="form-control form-control-lg"
                                           type="text"
                                           placeholder="Email"
                                           name="email"
                                           onChange={this.handleInputChange}/>

                                </fieldset>

                                <fieldset className="form-group">
                                    <input className="form-control form-control-lg"
                                           type="password"
                                           onChange={this.handleInputChange}
                                           name="password"
                                           placeholder="Password"/>
                                </fieldset>

                                <button className="btn btn-lg btn-primary pull-xs-right"
                                        disabled={this.state.isBusy}
                                        onClick={this.logIn}>
                                    Sign in
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LogIn);