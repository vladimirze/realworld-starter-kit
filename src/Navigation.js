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
        const isAuthenticated = !!(this.state.user && this.state.user);

        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    {
                        !isAuthenticated &&
                        <li>
                            <Link to="/login">Sign In</Link>
                        </li>
                    }

                    {
                        !isAuthenticated &&
                        <li>
                            <Link to="/register">Sign Up</Link>
                        </li>
                    }

                    {   isAuthenticated &&
                        <li>
                            <Link to="/editor">New Post</Link>
                        </li>
                    }

                    {
                        isAuthenticated &&
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                    }

                    {
                        isAuthenticated &&
                        <li>
                            <Link to={`/@${this.state.user.username}`}>{this.state.user.username}</Link>
                        </li>
                    }

                </ul>
            </nav>
        );
    }
}