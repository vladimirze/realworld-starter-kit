import {Component} from "react";
import {articleResource} from "../api/article";
import {Link} from "react-router-dom";
import {feedResource} from "../api/feed";
import React from "react";
import {ArticleLikeButton} from "./LikeButton";
import {date} from '../services/representator';
import {ArticleTags} from "./TagList";
import {pagination} from "../services/pagination";
import withNavigation from "../hoc/withNavigation";


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
                totalArticles: 0,
                totalPages: 0
            };

            this.getFeed = this.getFeed.bind(this);
            this.handleLikeButton = this.handleLikeButton.bind(this);
            this.updatePageQueryParam = this.updatePageQueryParam.bind(this);
        }

        getFeed() {
            this.setState({isReady: false});

            const queryParams = Object.assign(
                {},
                this.defaultQueryParams,
                {
                    limit: this.MAX_ITEMS_PER_PAGE,
                    offset: pagination.getPageOffset(this.props.location, this.MAX_ITEMS_PER_PAGE)
                }
            );

            this.feedRequest = dataSource(queryParams);
            this.feedRequest.promise.then((feed) => {
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

        updatePageQueryParam(page) {
            pagination.goPage(this.props.history, this.props.location, page);
        }

        componentDidMount() {
            this.getFeed();
        }

        componentDidUpdate(prevProps) {
            // if query parameter ?page changed. get a new page.
            const {page: prevPage} = prevProps.navigation.queryParams;
            const {page: currentPage} = this.props.navigation.queryParams;
            if (prevPage !== currentPage) {
                this.getFeed();
            }
        }

        componentWillUnmount() {
            for (const request of [this.feedRequest, this.favoriteRequest, this.unfavoriteRequest]) {
                if (request) {
                    request.abort();
                }
            }
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

                    {pagination.paginate(this.props.location, this.state.totalPages, this.updatePageQueryParam)}
                </div>
            );
        }
    }
}

const GlobalFeed = withNavigation(feedFactory(articleResource.getList, {}));
const PersonalFeed = withNavigation(feedFactory(feedResource.getList, {}));
const TagFeed = withNavigation(feedFactory(articleResource.getList, {}));

const authorFeedFactory = function(username) {
    return withNavigation(feedFactory(articleResource.getList, {author: username, limit: 5}));
};

const favoritedArticlesFeedFactory = function(username) {
    return withNavigation(feedFactory(articleResource.getList, {favorited: username, limit: 5}));
};

export {
    GlobalFeed,
    PersonalFeed,
    TagFeed,
    authorFeedFactory,
    favoritedArticlesFeedFactory
};
