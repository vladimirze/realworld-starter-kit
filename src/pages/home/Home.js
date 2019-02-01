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

        this.handleFeedChange = this.handleFeedChange.bind(this);
        this.onUserAuthentication = this.onUserAuthentication.bind(this);
        this.selectTag = this.selectTag.bind(this);
    }

    handleFeedChange(event) {
        this.setState({selectedFeed: event.target.value});
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

    render() {
        return (
            <div>
                Home Page
                <TagList onSelect={this.selectTag}/>

                <select onChange={this.handleFeedChange} value={this.state.selectedFeed}>
                    <option value={feedChoice.GLOBAL}>Global Feed</option>
                    {this.state.isUserAuthenticated && <option value={feedChoice.PERSONAL}>Your Feed</option>}
                    {this.state.selectedFeed === feedChoice.TAG && <option value={feedChoice.TAG}>{this.state.tag}</option>}
                </select>

                {this.state.selectedFeed === feedChoice.GLOBAL && <GlobalFeed/>}
                {this.state.selectedFeed === feedChoice.PERSONAL && <PersonalFeed/>}
                {this.state.selectedFeed === feedChoice.TAG && <TagFeed key={this.state.tag} tag={this.state.tag}/>}
            </div>
        );
    }
}