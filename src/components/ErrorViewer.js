import React, {Component} from 'react';


export class BadInput extends Error {} // 422

export class NotAuthorized extends Error {}

export class ErrorViewer extends Component {
    isEmptyObject() {
        return !this.props.errors || Object.keys(this.props.errors).length === 0;
    }

    render() {
        return (
            <div>
                {this.isEmptyObject() || <pre>{JSON.stringify(this.props.errors, null, 10)}</pre>}
            </div>
        );
    }
}