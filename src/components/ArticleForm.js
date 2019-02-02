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
                                               placeholder="Enter tags"
                                               value={this.state.article.tagList}
                                               name="tagList"
                                               onChange={this.handleInput}/>
                                            <div className="tag-list"></div>
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