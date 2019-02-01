import {Component} from "react";
import user from "../../resources/user";
import React from "react";
import {GlobalFeed, PersonalFeed, TagFeed} from "../../components/feed";
import TagList from "../../components/TagList";


// if user is authenticated default is 'personal', if not then 'global'
const feedChoice = {
    GLOBAL: 'global',
    PERSONAL: 'personal',
    TAG: 'tag', // user selected a tag
    NONE: 'none'
};

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserAuthenticated: false,
            selectedFeed: feedChoice.NONE
        };

        this.selectFeed = this.selectFeed.bind(this);
        this.onUserAuthentication = this.onUserAuthentication.bind(this);
        this.selectTag = this.selectTag.bind(this);
    }

    selectFeed(feed) {
        this.setState({selectedFeed: feed});
    }

    onUserAuthentication(isUserAuthenticated) {
        if (isUserAuthenticated) {
            this.setState({selectedFeed: feedChoice.PERSONAL});
        } else {
            this.setState({selectedFeed: feedChoice.GLOBAL});
        }

        this.setState({isUserAuthenticated: isUserAuthenticated});
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.onUserAuthentication);
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onUserAuthentication);
    }

    selectTag(tag) {
        this.setState({selectedFeed: feedChoice.TAG, tag: tag});
    }

    ifTagThen(tag, className) {
        return tag === this.state.selectedFeed ? className : '';
    }

    render() {
        return (
            <div className="home-page">

                <div className="banner">
                    <div className="container">
                        <h1 className="logo-font">conduit</h1>
                        <p>A place to share your knowledge.</p>
                    </div>
                </div>

                <div className="container page">
                    <div className="row">

                        <div className="col-md-9">
                            {/* Feed types */}
                            <div className="feed-toggle">
                                <ul className="nav nav-pills outline-active">
                                    {
                                        this.state.isUserAuthenticated &&
                                        <li className="nav-item u-cursor" onClick={() => {this.selectFeed(feedChoice.PERSONAL)}}>
                                            <span className={`nav-link ${this.ifTagThen(feedChoice.PERSONAL, "active")}`}>
                                                Your Feed
                                            </span>
                                        </li>
                                    }

                                    {
                                        <li className="nav-item u-cursor" onClick={() => {this.selectFeed(feedChoice.GLOBAL)}}>
                                            <span className={`nav-link ${this.ifTagThen(feedChoice.GLOBAL, "active")}`}>
                                                Global Feed
                                            </span>
                                        </li>
                                    }

                                    {
                                        this.state.selectedFeed === feedChoice.TAG &&
                                        <li className="nav-item u-cursor">
                                            <span className={`nav-link ${this.ifTagThen(feedChoice.TAG, "active")}`}>
                                                <i className="ion-pound"></i>
                                                {this.state.tag}
                                            </span>
                                        </li>
                                    }

                                </ul>
                            </div>

                            {/* Article feeds */}
                            {
                                this.state.selectedFeed === feedChoice.GLOBAL &&
                                <GlobalFeed/>
                            }

                            {
                                this.state.selectedFeed === feedChoice.PERSONAL &&
                                <PersonalFeed/>
                            }

                            {
                                this.state.selectedFeed === feedChoice.TAG &&
                                <TagFeed key={this.state.tag} tag={this.state.tag}/>
                            }
                        </div>

                        {/* Tags */}
                        <div className="col-md-3">
                            <div className="sidebar">
                                <p>Popular Tags</p>

                                <TagList onSelect={this.selectTag}/>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}