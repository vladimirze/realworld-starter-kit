import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";

import user from './user';
import {ErrorViewer} from "./error";


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
                this.props.history.push('/');
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
        const busyClassName = this.state.isBusy ? 'component-loader': '';

        return (
            <Fragment>
                <h1>Log-In</h1>
                <div className={busyClassName}>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="text"
                        value={this.state.email}
                        onChange={this.handleInputChange.bind(this)}/>

                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange.bind(this)}/>

                    <button onClick={this.logIn}>Log-In</button>

                    <ErrorViewer errors={this.state.errors}/>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(LogIn);