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
                {
                    !this.isEmptyObject() &&
                    <ul className="text-danger">
                        {
                            Object.keys(this.props.errors).map((errorKey) => {
                                return <li>{errorKey}: {this.props.errors[errorKey]}</li>
                            })
                        }
                    </ul>
                }
            </div>
        );
    }
}