import React, {Component, Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Registration from "./Registration";
import LogIn from './LogIn';

import jwt from './jwt';
import {abortController, addRequestInterceptor, addResponseInterceptor} from "./request";
import user from './user';
import Navigation from "./Navigation";
import {article} from './article';


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

class ArticleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            isReady: false
        };
    }

    componentDidMount() {
        article.getList()
            .then((articles) => {
                this.setState({articles: articles.articles, isReady: true});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        abortController.abort();
    }

    renderArticles() {
        return this.state.articles.map((article) => {
            return <div key={article.createdAt}>{article.title}</div>
        });
    }

    renderNoArticles() {
        return <div>No articles are here... yet.</div>
    }

    renderLoader() {
        return <div>loading...</div>;
    }

    render() {
        if (!this.state.isReady) {
            return this.renderLoader();
        } else if (this.state.articles.length === 0) {
            return this.renderNoArticles();
        } else {
            return this.renderArticles();
        }
    }
}

const GLOBAL_FEED = 'global';
const USER_FEED = 'user';
class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedArticleFeed: GLOBAL_FEED
        };

        this.handleArticleFeedChange = this.handleArticleFeedChange.bind(this);
    }

    handleArticleFeedChange(event) {
        this.setState({selectedArticleFeed: event.target.value});
    }

    render() {
        return (
            <div>
                Home Page
                <select onChange={this.handleArticleFeedChange}>
                    <option value={GLOBAL_FEED}>Global Feed</option>
                    <option value={USER_FEED}>Your Feed</option>
                </select>

                <ArticleList filterBy={this.state.selectedArticleFeed}/>
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
