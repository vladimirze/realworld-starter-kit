import {Component} from "react";
import {profileResource} from "../../resources/profile";
import {Link} from "react-router-dom";
import withAuthenticatedUser from "../../components/withAuthenticatedUser";
import React from "react";
import {authorFeedFactory, favoritedArticlesFeedFactory} from "../../components/feed";
import FollowUserButton from "../../components/FollowUserButton";


const feedChoice = {
    AUTHOR_ARTICLES: 'Author articles',
    AUTHOR_FAVORITES: 'Author favorites'
};

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            selectedFeed: feedChoice.AUTHOR_ARTICLES,
            AuthorFeed: undefined,
            FavoritedArticlesFeed: undefined
        };

        this.changeFeed = this.changeFeed.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
    }

    isOwner() {
        return this.props.currentUser.username === this.props.match.params.user;
    }

    componentDidMount() {
        this.getUserProfile();
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    ifFeedThen(feed, className) {
        return this.state.selectedFeed === feed ? className : '';
    }

    changeFeed(feed) {
        this.setState({selectedFeed: feed});
    }

    getUserProfile() {
        this.request = profileResource.get(this.props.match.params.user);
        this.request.promise
            .then((profile) => {
                this.setState({
                    profile: profile
                });

                if (!this.state.AuthorFeed || !this.state.FavoritedArticlesFeed) {
                    this.setState({
                        AuthorFeed: authorFeedFactory(profile.username),
                        FavoritedArticlesFeed: favoritedArticlesFeedFactory(profile.username)
                    });
                }
            })
            .catch(console.error);
    }

    render() {
        return (
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
                                                      onSuccess={this.getUserProfile}/>
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
                                    <li className="nav-item u-cursor" onClick={() => {this.changeFeed(feedChoice.AUTHOR_ARTICLES)}}>
                                        <span className={`nav-link ${this.ifFeedThen(feedChoice.AUTHOR_ARTICLES, "active")}`}>
                                            My Articles
                                        </span>
                                    </li>

                                    <li className="nav-item u-cursor" onClick={() => {this.changeFeed(feedChoice.AUTHOR_FAVORITES)}}>
                                        <span className={`nav-link ${this.ifFeedThen(feedChoice.AUTHOR_FAVORITES, "active")}`}>
                                            Favorited Articles
                                        </span>
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
        )
    }
}
export default withAuthenticatedUser(UserProfile);