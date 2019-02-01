import {Component} from "react";
import {tagResource} from "../resources/tag";
import React from "react";


export default class TagList extends Component {
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
            <div>
                <div className="tag-list">
                    {
                        this.state.tags.map((tag) => {
                            return (
                                <span className="tag-pill tag-default"
                                   key={tag}
                                   onClick={() => {this.selectTag(tag)}}>
                                    {tag}
                                </span>
                                );
                            }
                        )
                    }
                </div>
            </div>
        );
    }
}
