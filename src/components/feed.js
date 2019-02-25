import {Component} from "react";
import {articleResource} from "../api/article";
import {Link, withRouter} from "react-router-dom";
import {feedResource} from "../api/feed";
import React from "react";
import {ArticleLikeButton} from "./LikeButton";
import {date} from '../services/representator';
import {ArticleTags} from "./TagList";
import {pagination} from "../services/pagination";


function feedFactory(dataSource, queryParams) {
    return class Feed extends Component {
        constructor(props) {
            super(props);

            this.MAX_ITEMS_PER_PAGE = queryParams.limit || 10;
            this.defaultQueryParams = {...queryParams};
            if (this.props.tag) {
                this.defaultQueryParams.tag = this.props.tag;
            }
            this.state = {
                feed: [],
                isReady: false,
                pageNumber: pagination.getCurrentPageNumber(this.props.location),
                totalArticles: 0,
                totalPages: 0
            };

            this.getPage = this.getPage.bind(this);
            this.handleLikeButton = this.handleLikeButton.bind(this);
        }

        getFeed(promise) {
            this.setState({isReady: false});
            promise.then((feed) => {
                    this.setState({
                        feed: feed.articles,
                        isReady: true,
                        totalArticles: feed.articlesCount,
                        totalPages: pagination.getTotalPages(feed.articlesCount, this.MAX_ITEMS_PER_PAGE)
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
            const queryParams = Object.assign(
                {},
                this.defaultQueryParams,
                {limit: this.MAX_ITEMS_PER_PAGE, offset: pagination.getPageOffset(this.props.location, this.MAX_ITEMS_PER_PAGE)}
            );
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
            if (this.state.pageNumber === page) {
                return;
            }

            this.setState({pageNumber: page});
            pagination.goPage(this.props.history, this.props.location, page);

            const queryParams = Object.assign(
                {},
                this.defaultQueryParams,
                {limit: this.MAX_ITEMS_PER_PAGE, offset: pagination.getPageOffset(page, this.MAX_ITEMS_PER_PAGE)}
            );
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        // increment/decrement `favorited` field for an article in place instead of fetching articles again.
        handleLikeButton(response) {
            const articleSlug = response.article.slug;
            const index = this.state.feed.findIndex(article => article.slug === articleSlug);

            if (index === -1) {
                return;
            }

            const article = {...this.state.feed[index]};
            const feed = [...this.state.feed];

            article.favorited = !article.favorited;
            article.favoritesCount = article.favorited ? article.favoritesCount + 1 : article.favoritesCount - 1;

            feed.splice(index, 1, article);
            this.setState({feed: feed});
        }

        render() {
            return (
                <div>
                    {!this.state.isReady && <div>Loading articles...</div>}

                    {this.state.isReady && this.state.feed.length === 0 && <div>No articles are here... yet.</div>}

                    {this.state.isReady && this.state.feed.length > 0 &&
                        this.state.feed.map((article) => {
                            return (
                                <div className="article-preview" key={article.createdAt}>
                                    <div className="article-meta">
                                        {/* Author image*/}
                                        <Link to={`/@${article.author.username}`}>
                                            <img src={article.author.image} alt={article.author.username}/>
                                        </Link>

                                        {/* Author username */}
                                        <div className="info">
                                            <Link to={`/@${article.author.username}`} className="author">
                                                {article.author.username}
                                            </Link>

                                            <span className="date">{date.format(article.createdAt)}</span>
                                        </div>

                                        <ArticleLikeButton
                                            className="btn-sm pull-xs-right"
                                            articleSlug={article.slug}
                                            count={article.favoritesCount}
                                            isFavorited={article.favorited}
                                            onFavorite={this.handleLikeButton}
                                            onUnfavorite={this.handleLikeButton}>
                                        </ArticleLikeButton>
                                    </div>

                                    {/* Link to article */}
                                    <Link to={`/article/${article.slug}`} className="preview-link">
                                        <h1>{article.title}</h1>
                                        <p>{article.description}</p>
                                        <span>Read more...</span>
                                        <ArticleTags tags={article.tagList}/>
                                    </Link>
                                </div>
                            )
                        })
                    }

                    {pagination.paginate(this.props.location, this.state.totalPages, this.getPage)}
                </div>
            );
        }
    }
}

const GlobalFeed = withRouter(feedFactory(articleResource.getList, {}));
const PersonalFeed = withRouter(feedFactory(feedResource.getList, {}));
const TagFeed = withRouter(feedFactory(articleResource.getList, {}));

const authorFeedFactory = function(username) {
    return withRouter(feedFactory(articleResource.getList, {author: username, limit: 5}));
};

const favoritedArticlesFeedFactory = function(username) {
    return withRouter(feedFactory(articleResource.getList, {favorited: username, limit: 5}));
};

export {
    GlobalFeed,
    PersonalFeed,
    TagFeed,
    authorFeedFactory,
    favoritedArticlesFeedFactory
};
