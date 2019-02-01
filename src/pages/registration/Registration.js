import React, {Component, Fragment} from 'react';
import user from '../../resources/user';
import {ErrorViewer} from "../../components/ErrorViewer";
import {withRouter} from "react-router-dom";


class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            isBusy: false,
            errors: {}
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.register = this.register.bind(this);
    }

    register(event) {
        event.preventDefault();

        this.setState({isBusy: true, errors: {}});
        this.registrationRequest = user.register(this.state.username, this.state.email, this.state.password);
        this.registrationRequest.promise
            .then(user.logIn.bind(user, this.state.email, this.state.password))
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
        if (this.registrationRequest) {
            this.registrationRequest.abort();
        }
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const busyClassName = this.state.isBusy ? 'component-loader': '';

        return (
            <Fragment>
                <h1>Registration</h1>
                <div className={busyClassName}>
                    <label htmlFor="username">Username</label>
                    <input
                        name="username"
                        id="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleInputChange}/>

                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="text"
                        value={this.props.email}
                        onChange={this.handleInputChange}/>

                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        value={this.props.password}
                        onChange={this.handleInputChange}/>

                    <button onClick={this.register}>Register</button>

                    <ErrorViewer errors={this.state.errors}/>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(Registration);