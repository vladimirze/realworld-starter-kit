import {Component} from "react";
import user from "../api/user";
import React from "react";
import {GlobalFeed, PersonalFeed, TagFeed} from "../components/feed";
import {PopularTags} from "../components/TagList";
import {Link} from "react-router-dom";
import withNavigation from "../hoc/withNavigation";


// if user is authenticated default is 'personal', if not then 'global'
const feedChoice = {
    GLOBAL: 'global',
    PERSONAL: 'personal',
    TAG: 'tag', // user selected a tag
    NONE: 'none'
};

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUserAuthenticated: false,
            selectedFeed: feedChoice.NONE
        };

        this.selectFeed = this.selectFeed.bind(this);
        this.onUserAuthenticationChange = this.onUserAuthenticationChange.bind(this);
        this.selectTag = this.selectTag.bind(this);
        this.handleQueryParams = this.handleQueryParams.bind(this);
    }

    selectFeed(feed) {
        this.setState({selectedFeed: feed});
    }

    onUserAuthenticationChange(isUserAuthenticated) {
        this.setState({
            isUserAuthenticated: isUserAuthenticated,
            selectedFeed: isUserAuthenticated ? feedChoice.PERSONAL : feedChoice.GLOBAL
        });
    }

    componentDidMount() {
        user.isAuthenticated.subscribe(this.onUserAuthenticationChange);
        this.handleQueryParams();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.search !== this.props.location.search) {
            this.handleQueryParams();
        }
    }

    handleQueryParams() {
        const {feed, tag} = this.props.navigation.getQueryParams();

        if (feed && feedChoice.hasOwnProperty(feed.toUpperCase())) {
            this.selectFeed(feed);
        } else if (tag) {
            this.selectTag(tag);
        }
    }

    componentWillUnmount() {
        user.isAuthenticated.unsubscribe(this.onUserAuthenticationChange);
    }

    selectTag(tag) {
        this.setState({selectedFeed: feedChoice.TAG, tag});
        this.props.navigation.updateQueryParams({tag}, {preserveQueryParams: false});
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
                                        <li className="nav-item u-cursor">
                                            <Link to="?feed=personal" className={`nav-link ${this.ifTagThen(feedChoice.PERSONAL, "active")}`}>
                                                Your Feed
                                            </Link>
                                        </li>
                                    }

                                    {
                                        <li className="nav-item u-cursor">
                                            <Link to='/?feed=global' className={`nav-link ${this.ifTagThen(feedChoice.GLOBAL, "active")}`}>
                                                Global Feed
                                            </Link>
                                        </li>
                                    }

                                    {
                                        this.state.selectedFeed === feedChoice.TAG &&
                                        <li className="nav-item u-cursor">
                                            <Link to={`?tag=${this.state.tag}`} className={`nav-link ${this.ifTagThen(feedChoice.TAG, "active")}`}>
                                                <i className="ion-pound"></i>
                                                {this.state.tag}
                                            </Link>
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

                                <PopularTags onSelect={this.selectTag}/>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

export default withNavigation(HomePage);
