import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";

import users from './users';

class LogIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isBusy: false
        };

        this.logIn = this.logIn.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    logIn(event) {
        event.preventDefault();

        this.setState({isBusy: true});
        users.logIn(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/');
            })
            .catch(console.error)
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
                </div>
            </Fragment>
        );
    }
}

export default withRouter(LogIn);