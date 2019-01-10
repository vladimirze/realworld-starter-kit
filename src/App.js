import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {addRequestInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";


addRequestInterceptor((url, options) => {
    const token = jwt.get();
    if (token) {
        options.headers['Authorization'] = `Token ${token}`;
    }

    return [url, options];
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

class App extends Component {
    render() {
        return (
            <Fragment>
                <Router>
                    <div>
                        <Navigation/>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/register" component={Registration}/>
                        <Route path="/login" component={LogIn}/>
                    </div>
                </Router>
            </Fragment>
        );
    }
}

export default App;
