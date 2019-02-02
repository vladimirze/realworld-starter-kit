import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
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
            <nav className="navbar navbar-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">conduit</Link>

                    <ul className="nav navbar-nav pull-xs-right">
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink>
                        </li>

                        {
                            this.state.isAuthenticated &&
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/editor">
                                    <i className="ion-compose"></i>&nbsp;New Post
                                </NavLink>
                            </li>
                        }

                        {
                            this.state.isAuthenticated &&
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/settings">
                                    <i className="ion-gear-a"></i>&nbsp;Settings
                                </NavLink>
                            </li>
                        }

                        {
                            !this.state.isAuthenticated &&
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/login">Sign in</NavLink>
                            </li>
                        }

                        {
                            !this.state.isAuthenticated &&
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to="/register">Sign up</NavLink>
                            </li>
                        }

                        {
                            this.state.isAuthenticated &&
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="active" to={`/@${this.state.user.username}`}>
                                    {this.state.user.username}
                                </NavLink>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
        );
    }
}