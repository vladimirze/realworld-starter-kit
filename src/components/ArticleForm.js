import {Component} from "react";
import React from "react";


export default class ArticleForm extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.state = {
            article: {
                title: this.props.title || '',
                description: this.props.description || '',
                body: this.props.body || '',
                tagList: (this.props.tagList && this.props.tagList.join()) || ''
            }
        };
    }

    onSubmit(event) {
        event.preventDefault();
        const tagList = this.state.article.tagList.length > 0 ? this.state.article.tagList.split(' ') : [];
        this.props.onSubmit({...this.state.article, tagList: tagList});
    }

    handleInput(event) {
        const article = {...this.state.article, [event.target.name]: event.target.value};
        this.setState({article: article});
    }

    render() {
        return (
            <form>
                <input
                    name="title"
                    type="text"
                    placeholder="Article Title"
                    value={this.state.article.title}
                    onChange={this.handleInput}/>

                <input
                    name="description"
                    type="text"
                    placeholder="Whats this article about?"
                    value={this.state.article.description}
                    onChange={this.handleInput}/>

                <textarea
                    name="body"
                    placeholder="Write your article (markdown)"
                    value={this.state.article.body}
                    onChange={this.handleInput}/>

                <input
                    name="tagList"
                    type="text"
                    placeholder="tags"
                    value={this.state.article.tagList}
                    onChange={this.handleInput}/>

                <button onClick={this.onSubmit}>Publish Article</button>
            </form>
        );
    }
}