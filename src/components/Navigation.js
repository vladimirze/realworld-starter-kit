import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import user from "../resources/user";


export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };

        this.updateUser = this.updateUser.bind(this);
        this.updateIsAuthenticated = this.updateIsAuthenticated.bind(this);
    }

    updateUser(authenticatedUser) {
        this.setState({user: authenticatedUser});
    }

    updateIsAuthenticated(isAuthenticated) {
        this.setState({isAuthenticated: isAuthenticated});
    }

    componentDidMount() {
        user.currentUser.subscribe(this.updateUser);
        user.isAuthenticated.subscribe(this.updateIsAuthenticated)
    }

    componentWillUnmount() {
        user.currentUser.unsubscribe(this.updateUser);
        user.isAuthenticated.unsubscribe(this.updateIsAuthenticated);
    }

    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    {
                        !this.state.isAuthenticated &&
                        <li>
                            <Link to="/login">Sign In</Link>
                        </li>
                    }

                    {
                        !this.state.isAuthenticated &&
                        <li>
                            <Link to="/register">Sign Up</Link>
                        </li>
                    }

                    {   this.state.isAuthenticated &&
                        <li>
                            <Link to="/editor">New Post</Link>
                        </li>
                    }

                    {
                        this.state.isAuthenticated &&
                        <li>
                            <Link to="/settings">Settings</Link>
                        </li>
                    }

                    {
                        this.state.isAuthenticated &&
                        <li>
                            <Link to={`/@${this.state.user.username}`}>{this.state.user.username}</Link>
                        </li>
                    }

                </ul>
            </nav>
        );
    }
}