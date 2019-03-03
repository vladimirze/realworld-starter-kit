import {Component} from "react";
import React from "react";
import TagList from "./TagList";


export default class ArticleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            article: {
                title: this.props.title || '',
                description: this.props.description || [],
                body: this.props.body || '',
                tagList: this.props.tagList || []
            }
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleTagInput = this.handleTagInput.bind(this);
        this.getSanitizedTagList = this.getSanitizedTagList.bind(this);
        this.removeTag = this.removeTag.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

        this.props.onSubmit({...this.state.article, tagList: this.getSanitizedTagList()});
    }

    handleInput(event) {
        const article = {...this.state.article, [event.target.name]: event.target.value};
        this.setState({article: article});
    }

    handleTagInput(event) {
        const tags = event.target.value.split(' ');
        this.setState({article: Object.assign({}, this.state.article, {[event.target.name]: tags})});
    }

    getSanitizedTagList() {
        return this.state.article.tagList.filter(tag => tag.length > 0);
    }

    removeTag(tagToRemove) {
        const index = this.state.article.tagList.findIndex(tag => tag === tagToRemove);
        const updatedTagList = [...this.state.article.tagList];
        updatedTagList.splice(index, 1);

        this.setState({article: Object.assign({}, this.state.article, {tagList: updatedTagList})});
    }

    render() {
        return (
            <div className="editor-page">
                <div className="container page">
                    <div className="row">

                        <div className="col-md-10 offset-md-1 col-xs-12">
                            <form>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input type="text"
                                               className="form-control form-control-lg"
                                               placeholder="Article Title"
                                               value={this.state.article.title}
                                               name="title"
                                               onChange={this.handleInput}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input type="text"
                                               className="form-control"
                                               placeholder="What's this article about?"
                                               value={this.state.article.description}
                                               name="description"
                                               onChange={this.handleInput}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <textarea className="form-control"
                                                  rows="8"
                                                  placeholder="Write your article (in markdown)"
                                                  value={this.state.article.body}
                                                  name="body"
                                                  onChange={this.handleInput}></textarea>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input type="text"
                                               className="form-control"
                                               placeholder="Enter tags separated by space"
                                               value={this.state.article.tagList.join(' ')}
                                               name="tagList"
                                               onChange={this.handleTagInput}/>
                                        {<TagList tags={this.getSanitizedTagList()} onTagRemove={this.removeTag}/>}
                                    </fieldset>

                                    <button className="btn btn-lg pull-xs-right btn-primary"
                                            type="button"
                                            onClick={this.onSubmit}>
                                        Publish Article
                                    </button>
                                </fieldset>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}