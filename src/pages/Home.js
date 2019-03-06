import {Component} from "react";
import React from "react";
import {GlobalFeed, PersonalFeed, TagFeed} from "../components/feed";
import {PopularTags} from "../components/TagList";
import {Link} from "react-router-dom";
import withNavigation from "../hoc/withNavigation";
import withAuthenticatedUser from "../hoc/withAuthenticatedUser";
import {authenticationStatusEnum} from "../api/user";


// if user is authenticated default feed is 'personal', if not then 'global'
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
            selectedFeed: feedChoice.NONE
        };

        this.updateTagQueryParam = this.updateTagQueryParam.bind(this);
        this.handleQueryParams = this.handleQueryParams.bind(this);
        this.getDefaultFeed = this.getDefaultFeed.bind(this);
    }

    getDefaultFeed() {
        switch (this.props.authenticationStatus) {
            case authenticationStatusEnum.AUTHENTICATED:
                return feedChoice.PERSONAL;
            case authenticationStatusEnum.NOT_AUTHENTICATED:
                return feedChoice.GLOBAL;
            default:
                return feedChoice.NONE;
        }
    }

    handleQueryParams() {
        const {feed, tag} = this.props.navigation.queryParams;

        if (feed && feedChoice.hasOwnProperty(feed.toUpperCase())) {
            if ((feed === feedChoice.PERSONAL) &&
                this.props.authenticationStatus !== authenticationStatusEnum.AUTHENTICATED) {
                // viewing personal feed allowed only for authenticated users
                this.props.navigation.go('/login', {state: {from: this.props.location}});
            }
            this.setState({selectedFeed: feed});
        } else if (tag) {
            this.setState({selectedFeed: feedChoice.TAG, tag});
        } else {
            this.setState({selectedFeed: this.getDefaultFeed()});
        }
    }

    updateTagQueryParam(tag) {
        this.props.navigation.updateQueryParams({tag}, {preserveQueryParams: false});
    }

    ifTagThen(tag, className) {
        return tag === this.state.selectedFeed ? className : '';
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.authenticationStatus !== this.props.authenticationStatus) ||
            (prevProps.location.search !== this.props.location.search)) {
            this.handleQueryParams();
        }
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
                                        (this.props.authenticationStatus === authenticationStatusEnum.AUTHENTICATED) &&
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

                                <PopularTags onSelect={this.updateTagQueryParam}/>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

export default withAuthenticatedUser(withNavigation(HomePage));
