import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import user from "./user";


export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };

        this.updateUser = this.updateUser.bind(this);
    }

    updateUser(authenticatedUser) {
        this.setState({user: authenticatedUser});
    }

    componentDidMount() {
        user.currentUser.subscribe(this.updateUser);
    }

    componentWillUnmount() {
        user.currentUser.unsubscribe(this.updateUser);
    }

    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="editor">New Post</Link>
                    </li>

                    <li>
                        <Link to="settings">Settings</Link>
                    </li>

                    {
                        this.state.user && this.state.user.user &&
                        <li>
                            <Link to={`/@${this.state.user.user.username}`}>{this.state.user.user.username}</Link>
                        </li>
                    }

                </ul>
            </nav>
        );
    }
}