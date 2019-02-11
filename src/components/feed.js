// TODO: read page number from URL
// TODO: make pagination.js module to handle page enumeration logic
import {Component} from "react";
import {articleResource} from "../resources/article";
import {Link} from "react-router-dom";
import {feedResource} from "../resources/feed";
import React from "react";
import {ArticleLikeButton} from "./LikeButton";
import {date} from '../services/representator';
import {ArticleTags} from "./TagList";


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
                pageNumber: 1,
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
                        totalPages: Math.ceil(feed.articlesCount / this.MAX_ITEMS_PER_PAGE)
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
            const queryParams = Object.assign({}, this.defaultQueryParams, {limit: this.MAX_ITEMS_PER_PAGE, offset: 0});
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
                {limit: this.MAX_ITEMS_PER_PAGE, offset: (this.MAX_ITEMS_PER_PAGE * page) - this.MAX_ITEMS_PER_PAGE}
            );
            this.feedRequest = dataSource(queryParams);
            this.getFeed(this.feedRequest.promise);
        }

        paginate() {
            const pages = [];
            for (let i = 1; i <= this.state.totalPages; i += 1) {
                pages.push(
                    (
                        <li className={`u-cursor page-item ${this.state.pageNumber === i ? 'active' : ''}`}
                            key={i}
                            onClick={() => {this.getPage(i)}}>
                            <span className="page-link">
                                {i}
                            </span>
                        </li>
                    )
                );
            }

            return (
                <ul className="pagination">
                    {pages}
                </ul>
            );
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

                    {this.paginate()}
                </div>
            );
        }
    }
}

const GlobalFeed = feedFactory(articleResource.getList, {});
const PersonalFeed = feedFactory(feedResource.getList, {});
const TagFeed = feedFactory(articleResource.getList, {});

const authorFeedFactory = function(username) {
    return feedFactory(articleResource.getList, {author: username, limit: 5});
};

const favoritedArticlesFeedFactory = function(username) {
    return feedFactory(articleResource.getList, {favorited: username, limit: 5});
};

export {
    GlobalFeed,
    PersonalFeed,
    TagFeed,
    authorFeedFactory,
    favoritedArticlesFeedFactory
};
