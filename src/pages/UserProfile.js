import {Component} from "react";
import {profileResource} from "../resources/profile";
import {Link, withRouter} from "react-router-dom";
import withAuthenticatedUser from "../components/withAuthenticatedUser";
import React from "react";
import {authorFeedFactory, favoritedArticlesFeedFactory} from "../components/feed";
import {FollowUserButton} from "../components/FollowButton";
import NotFound404 from "../components/NotFound404";


const feedChoice = {
    AUTHOR_ARTICLES: 'Author articles',
    AUTHOR_FAVORITES: 'Author favorites'
};

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            selectedFeed: this.getSelectedFeedFromQueryParams(),
            AuthorFeed: undefined,
            FavoritedArticlesFeed: undefined,
            isUserProfileNotFound: false
        };

        this.getUserProfile = this.getUserProfile.bind(this);
        this.prepareUserProfilePage = this.prepareUserProfilePage.bind(this);
        this.getSelectedFeedFromQueryParams = this.getSelectedFeedFromQueryParams.bind(this);
    }

    getSelectedFeedFromQueryParams() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const feed = queryParams.get('feed');

        if (feed && feedChoice.hasOwnProperty(feed.toUpperCase())) {
            return feedChoice[feed.toUpperCase()];
        } else {
            return feedChoice.AUTHOR_ARTICLES;
        }
    }

    isOwner() {
        return this.props.currentUser.username === this.props.match.params.user;
    }

    componentDidMount() {
        this.prepareUserProfilePage();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.user !== this.props.match.params.user) {
            this.prepareUserProfilePage();
        } else if (prevProps.location.search !== this.props.location.search) {
            this.setState({selectedFeed: this.getSelectedFeedFromQueryParams()});
        }
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    ifFeedThen(feed, className) {
        return this.state.selectedFeed === feed ? className : '';
    }

    prepareUserProfilePage() {
        this.getUserProfile()
            .then((profile) => {
                this.getUserFeed(profile);
            });
    }

    getUserProfile() {
        this.request = profileResource.get(this.props.match.params.user);
        this.request.promise = this.request.promise.then((profile) => {
                this.setState({profile: profile});
                return profile;
            })
            .catch((error) => {
                if (error.statusCode === 404) {
                    this.setState({isUserProfileNotFound: true});
                }
            });

        return this.request.promise;
    }

    getUserFeed(profile) {
        this.setState({
            AuthorFeed: authorFeedFactory(profile.username),
            FavoritedArticlesFeed: favoritedArticlesFeedFactory(profile.username)
        });
    }

    render() {
        return (
            <NotFound404 isShown={this.state.isUserProfileNotFound}>
                <div className="profile-page">

                    <div className="user-info">
                        <div className="container">
                            <div className="row">

                                <div className="col-xs-12 col-md-10 offset-md-1">
                                    <img src={this.state.profile.image} className="user-img"
                                         alt={`${this.state.profile.username} avatar`}/>

                                    <h4>{this.state.profile.username}</h4>

                                    <p>{this.state.profile.bio}</p>

                                    {
                                        this.isOwner() &&
                                        <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                                            <i className="ion-gear-a"></i> Edit Profile Settings
                                        </Link>
                                    }

                                    {
                                        !this.isOwner() &&
                                        <FollowUserButton className="action-btn"
                                                          profile={this.state.profile}
                                                          onFollow={this.getUserProfile}
                                                          onUnfollow={this.getUserProfile}/>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row">

                            <div className="col-xs-12 col-md-10 offset-md-1">
                                <div className="articles-toggle">
                                    <ul className="nav nav-pills outline-active">
                                        <li className="nav-item u-cursor">
                                            <Link to={{search: '?feed=author_articles'}} className={`nav-link ${this.ifFeedThen(feedChoice.AUTHOR_ARTICLES, "active")}`}>
                                                My Articles
                                            </Link>
                                        </li>

                                        <li className="nav-item u-cursor">
                                            <Link to={{search: '?feed=author_favorites'}} className={`nav-link ${this.ifFeedThen(feedChoice.AUTHOR_FAVORITES, "active")}`}>
                                                Favorited Articles
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Author articles */}
                                {
                                    this.state.profile.username && this.state.selectedFeed === feedChoice.AUTHOR_ARTICLES &&
                                    this.state.AuthorFeed && <this.state.AuthorFeed/>
                                }

                                {/* Author favorited articles */}
                                {
                                    this.state.profile.username && this.state.selectedFeed === feedChoice.AUTHOR_FAVORITES &&
                                    this.state.FavoritedArticlesFeed && <this.state.FavoritedArticlesFeed/>
                                }
                            </div>

                        </div>
                    </div>

                </div>
            </NotFound404>
        )
    }
}
export default withRouter(withAuthenticatedUser(UserProfile));