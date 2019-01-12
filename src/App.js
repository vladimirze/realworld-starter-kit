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

// TODO: read page number from URL
// TODO: make pagination.js module to handle page enumeration logic
function feedFactory(dataSource, pageLimit=10) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.pageLimit = pageLimit;
            this.state = {
                feed: [],
                isReady: false,
                pageNumber: 1,
                totalArticles: 0,
                totalPages: 0
            };

            this.getPage = this.getPage.bind(this);
        }

        getFeed(promise) {
            this.setState({isReady: false});
            promise.then((feed) => {
                    this.setState({
                        feed: feed.articles,
                        isReady: true,
                        totalArticles: feed.articlesCount,
                        totalPages: Math.ceil(feed.articlesCount / this.pageLimit)
                    });
                })
                .catch((error) => {
                    if (error.name === "AbortError") {
                        return
                    }

                    console.error(error);
                    this.setState({isReady: false});
                });
        }

        componentDidMount() {
            this.feedRequest = dataSource();
            this.getFeed(this.feedRequest.promise);
        }

        componentWillUnmount() {
            if (this.feedRequest) {
                this.feedRequest.abort();
            }
        }

        getPage(page) {
            this.setState({pageNumber: page});
            this.feedRequest = dataSource(this.pageLimit, (this.pageLimit * page) - this.pageLimit);
            this.getFeed(this.feedRequest.promise);
        }

        paginate() {
            const pages = [];
            for (let i = 1; i <= this.state.totalPages; i += 1) {
                pages.push(<span key={i} onClick={() => {this.getPage(i)}}>{i}</span>);
            }
            return pages;
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

                    {this.paginate()}
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
