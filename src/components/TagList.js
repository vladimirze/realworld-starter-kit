import {Component} from "react";
import React from "react";
import {tagResource} from "../resources/tag";


export default class TagList extends Component {
    constructor(props) {
        super(props);

        this.onTagClick = this.onTagClick.bind(this);
    }

    onTagClick(tag) {
        if (this.props.onTagClick) {
            this.props.onTagClick(tag);
        }
    }

    render() {
        const cursorClass = this.props.onTagClick !== undefined ? 'u-cursor' : ''

        return (
            <ul className="tag-list">
                {
                    this.props.tags.map((tag) => {

                        return (
                            <li className={`tag-pill tag-default ${cursorClass}`} key={tag} onClick={() => {this.onTagClick(tag)}}>
                                {tag}
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
}

export class ArticleTags extends Component {
    render() {
        return <TagList tags={this.props.tags}/>
    }
}

export class PopularTags extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: []
        };

        this.selectTag = this.selectTag.bind(this);
    }

    componentDidMount() {
        this.request = tagResource.getList();
        this.request.promise
            .then((response) => {
                this.setState({tags: response.tags});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    selectTag(tag) {
        this.props.onSelect(tag);
    }

    render() {
        return (
            <TagList tags={this.state.tags} onTagClick={this.selectTag}/>
        );
    }
}
