import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Registration from "./pages/Registration";
import LogIn from './pages/LogIn';

import {jwt} from './services/jwt';
import {addRequestInterceptor} from "./services/request";
import user, {authenticationStatusEnum} from './api/user';
import Navigation from "./components/Navigation";
import ProfileSettings from "./pages/ProfileSettings";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import ArticleViewer from "./pages/ArticleViewer";
import ArticleEditor from "./pages/ArticleEditor";
import ArticleCreator from "./pages/ArticleCreator";
import {Footer} from "./components/Footer";
import withAuthenticatedUser from "./hoc/withAuthenticatedUser";


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

class App extends Component {
    componentDidMount() {
        if (jwt.isSet()) {
            user.getCurrentUser();
        }
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

export default withAuthenticatedUser(App);
