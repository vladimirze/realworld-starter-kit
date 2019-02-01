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
                Popular Tags
                <div>
                    {
                        this.state.tags.map(
                            tag => <span onClick={() => {this.selectTag(tag)}} key={tag}>{tag} |</span>
                        )
                    }
                </div>
            </div>
        );
    }
}
