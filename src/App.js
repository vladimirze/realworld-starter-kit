import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Registration from "./pages/registration/Registration";
import LogIn from './pages/login/LogIn';

import jwt from './services/jwt';
import {addRequestInterceptor, addResponseInterceptor} from "./services/request";
import user from './resources/user';
import Navigation from "./components/Navigation";
import ProfileSettings from "./pages/profile-settings/ProfileSettings";
import Home from "./pages/home/Home";
import UserProfile from "./pages/user-profile/UserProfile";
import ArticleViewer from "./pages/article/ArticleViewer";
import ArticleEditor from "./pages/article-editor/ArticleEditor";
import ArticleCreator from "./pages/article-creator/ArticleCreator";


// TODO: when going Home from any other page request to Global Feed gets initiated and immediately canceled
// TODO: handle errors properly (e.g on 404 the loader is stuck because isReady is never reset)
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
                    <Fragment>
                        <Navigation/>
                        <Switch>
                            <Route path="/" exact component={Home}/>
                            <Route path="/register" component={Registration}/>
                            <Route path="/login" component={LogIn}/>
                            <Route path="/@:user" component={UserProfile}/>
                            <Route path="/editor/:slug" component={ArticleEditor}/>
                            <Route path="/editor" component={ArticleCreator}/>
                            <Route path="/article/:slug" component={ArticleViewer}/>
                            <Route path="/settings" component={ProfileSettings}/>
                        </Switch>
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}

export default App;
