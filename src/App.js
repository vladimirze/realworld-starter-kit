import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {addRequestInterceptor, addResponseInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";


addRequestInterceptor((url, options) => {
    const token = jwt.get();
    if (token) {
        options.headers['Authorization'] = `Token ${token}`;
    }

    return [url, options];
});

addResponseInterceptor((response) => {
    // not authorized
    if (response.status === 401) {
        // TODO: get a new token and retry the request? or log out user?
        user.logOut();
    }

    return response;
});

class HomePage extends Component {
    render() {
        return (
            <div>
                Home Page
            </div>
        );
    }
}

class UserProfile extends Component {
    render() {
        return (
            <div>
                {this.props.match.params.user} Profile.
            </div>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };

        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    checkAuthentication(isAuthenticated) {
        this.setState({isAuthenticated: isAuthenticated});
        if (isAuthenticated) {
            user.getCurrentUser();
        }
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.checkAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.checkAuthentication);
    }

    render() {
        return (
            <Fragment>
                <Router>
                    <div>
                        <Navigation/>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/register" component={Registration}/>
                        <Route path="/login" component={LogIn}/>
                        <Route path="/@:user" component={UserProfile}/>
                    </div>
                </Router>
            </Fragment>
        );
    }
}

export default App;
