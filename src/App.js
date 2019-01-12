import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {addRequestInterceptor, addResponseInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";
import {article} from './article';
import {feed} from "./feed";

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


function feedFactory(dataSource) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.state = {
                feed: [],
                isReady: false
            };
        }

        componentDidMount() {
            this.feedRequest = dataSource();
            this.feedRequest.promise.then((feed) => {
                    this.setState({feed: feed.articles, isReady: true});
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        return
                    }

                    console.error(error);
                    this.setState({isReady: false});
                });
        }

        componentWillUnmount() {
            if (this.feedRequest) {
                this.feedRequest.abort();
            }
        }

        render() {
            return (
                <div>
                    {!this.state.isReady && <div>Loading articles...</div>}

                    {this.state.isReady && this.state.feed.length === 0 && <div>No articles are here... yet.</div>}

                    {this.state.isReady && this.state.feed.length > 0 &&
                        this.state.feed.map((article) => {
                            return <div key={article.createdAt}>{article.title}</div>
                        })
                    }
                </div>
            );
        }
    }
}

const GlobalFeed = feedFactory(article.getList);
const PersonalFeed = feedFactory(feed.getList);


// if user is authenticated default is 'personal', if not then 'global'
const feedChoice = {
    GLOBAL: 'global',
    PERSONAL: 'personal'
};

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserAuthenticated: false,
            selectedFeed: feedChoice.GLOBAL
        };

        this.handleFeedChange = this.handleFeedChange.bind(this);
        this.onUserAuthentication = this.onUserAuthentication.bind(this);
    }

    handleFeedChange(event) {
        this.setState({selectedFeed: event.target.value});
    }

    onUserAuthentication(isUserAuthenticated) {
        if (isUserAuthenticated) {
            this.setState({selectedFeed: feedChoice.PERSONAL});
        }
        this.setState({isUserAuthenticated: isUserAuthenticated});
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.onUserAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onUserAuthentication);
    }

    render() {
        return (
            <div>
                Home Page
                <select onChange={this.handleFeedChange} value={this.state.selectedFeed}>
                    <option value={feedChoice.GLOBAL}>Global Feed</option>
                    {this.state.isUserAuthenticated && <option value={feedChoice.PERSONAL}>Your Feed</option>}
                </select>

                {this.state.selectedFeed === feedChoice.GLOBAL && <GlobalFeed/>}
                {this.state.selectedFeed === feedChoice.PERSONAL && <PersonalFeed/>}
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
