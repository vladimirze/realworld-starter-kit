// TODO: read page number from URL
// TODO: make pagination.js module to handle page enumeration logic
import {Component} from "react";
import {articleResource} from "../resources/article";
import {Link} from "react-router-dom";
import {feedResource} from "../resources/feed";
import React from "react";
import LikeButton from "./LikeButton";


function feedFactory(dataSource, queryParams) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.PAGE_LIMIT = 10;
            this.defaultQueryParams = {...queryParams};
            if (this.props.tag) {
                this.defaultQueryParams.tag = this.props.tag;
            }
            this.state = {
                feed: [],
                isReady: false,
                pageNumber: 1,
                totalArticles: 0,
                totalPages: 0
            };

            this.getPage = this.getPage.bind(this);
            this.favorite = this.favorite.bind(this);
            this.unfavorite = this.unfavorite.bind(this);
        }

        getFeed(promise) {
            this.setState({isReady: false});
            promise.then((feed) => {
                    this.setState({
                        feed: feed.articles,
                        isReady: true,
                        totalArticles: feed.articlesCount,
                        totalPages: Math.ceil(feed.articlesCount / this.PAGE_LIMIT)
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
            const queryParams = Object.assign({}, this.defaultQueryParams, {limit: this.PAGE_LIMIT, offset: 0});
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        componentWillUnmount() {
            if (this.feedRequest) {
                this.feedRequest.abort();
            }

            if (this.favoriteRequest) {
                this.favoriteRequest.abort();
            }

            if (this.unfavoriteRequest) {
                this.unfavoriteRequest.abort();
            }
        }

        getPage(page) {
            this.setState({pageNumber: page});
            const queryParams = Object.assign(
                {},
                this.defaultQueryParams,
                {limit: this.PAGE_LIMIT, offset: (this.PAGE_LIMIT * page) - this.PAGE_LIMIT}
            );
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        paginate() {
            const pages = [];
            for (let i = 1; i <= this.state.totalPages; i += 1) {
                pages.push(<span key={i} onClick={() => {this.getPage(i)}}>{i}</span>);
            }
            return pages;
        }

        favorite(articleSlug) {
            this.favoriteRequest = articleResource.favorite(articleSlug);
            this.favoriteRequest.promise.then(() => {
                const index = this.state.feed.findIndex(article => article.slug === articleSlug);
                if (index >= 0) {
                    const article = {...this.state.feed[index]};
                    const feed = [...this.state.feed];

                    article.favorited = true;
                    article.favoritesCount += 1;
                    feed.splice(index, 1, article);

                    this.setState({feed: feed});
                }
            })
            .catch(console.error);
        }

        unfavorite(articleSlug) {
            this.unfavoriteRequest = articleResource.unfavorite(articleSlug);
            this.unfavoriteRequest.promise.then(() => {
                const index = this.state.feed.findIndex(article => article.slug === articleSlug);
                if (index >= 0) {
                    const article = {...this.state.feed[index]};
                    const feed = [...this.state.feed];

                    article.favorited = false;
                    article.favoritesCount -= 1;
                    feed.splice(index, 1, article);

                    this.setState({feed: feed});
                }
            })
            .catch(console.error);
        }

        render() {
            return (
                <div>
                    {!this.state.isReady && <div>Loading articles...</div>}

                    {this.state.isReady && this.state.feed.length === 0 && <div>No articles are here... yet.</div>}

                    {this.state.isReady && this.state.feed.length > 0 &&
                        this.state.feed.map((article) => {
                            return (
                                <div key={article.createdAt}>
                                    <Link to={`/article/${article.slug}`}>{article.title}</Link>
                                    | <span>by {article.author.username}</span>
                                    | <LikeButton articleSlug={article.slug}
                                                  count={article.favoritesCount}
                                                  isFavorited={article.favorited}
                                                  onFavorite={this.favorite}
                                                  onUnfavorite={this.unfavorite}/>
                                </div>
                            )
                        })
                    }

                    {this.paginate()}
                </div>
            );
        }
    }
}

const GlobalFeed = feedFactory(articleResource.getList, {});
const PersonalFeed = feedFactory(feedResource.getList, {});
const TagFeed = feedFactory(articleResource.getList, {});

export { GlobalFeed, PersonalFeed, TagFeed };
