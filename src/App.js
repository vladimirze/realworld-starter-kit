import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Registration from "./pages/registration/Registration";
import LogIn from './pages/login/LogIn';

import jwt from './services/jwt';
import {addRequestInterceptor} from "./services/request";
import user from './resources/user';
import Navigation from "./components/Navigation";
import ProfileSettings from "./pages/profile-settings/ProfileSettings";
import Home from "./pages/home/Home";
import UserProfile from "./pages/user-profile/UserProfile";
import ArticleViewer from "./pages/article/ArticleViewer";
import ArticleEditor from "./pages/article-editor/ArticleEditor";
import ArticleCreator from "./pages/article-creator/ArticleCreator";
import Footer from "./components/Footer";


addRequestInterceptor((url, options) => {
    const token = jwt.get();
    if (token) {
        options.headers['Authorization'] = `Token ${token}`;
    }

    return [url, options];
});

class ProtectedRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRouteReady: false,
            isAuthenticated: false
        };

        this.isAuthenticatedUser = this.isAuthenticatedUser.bind(this);
        this.isAnonymousUser = this.isAnonymousUser.bind(this);
        this.onAuthentication = this.onAuthentication.bind(this);
    }

    onAuthentication(isAuthenticated) {
        this.setState({isAuthenticated: isAuthenticated, isRouteReady: true});
    }


    componentDidMount() {
        user.isAuthenticated.subscribe(this.onAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onAuthentication);
    }

    isAuthenticatedUser() {
        return this.state.isRouteReady && this.state.isAuthenticated;
    }

    isAnonymousUser() {
        return this.state.isRouteReady && !this.state.isAuthenticated;
    }

    render() {
        const {component: Component, ...rest} = this.props;

        return (
            <Fragment>
                {
                    !this.state.isRouteReady &&
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


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };

        this.onAuthentication = this.onAuthentication.bind(this);
    }

    onAuthentication(isAuthenticated) {
        this.setState({isAuthenticated: isAuthenticated});
        if (isAuthenticated) {
            user.getCurrentUser();
        }
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.onAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onAuthentication);
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
                            <ProtectedRoute path="/editor/:slug" component={ArticleEditor}/>
                            <ProtectedRoute path="/editor" component={ArticleCreator}/>
                            <Route path="/article/:slug" component={ArticleViewer}/>
                            <ProtectedRoute path="/settings" component={ProfileSettings}/>
                        </Switch>

                        <Footer/>
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}

export default App;
