import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {authenticationStatusEnum} from "../api/user";
import withAuthenticatedUser from "../hoc/withAuthenticatedUser";


const Navigation = (props) => {
    const isAuthenticated = props.authenticationStatus === authenticationStatusEnum.AUTHENTICATED;

    return (
        <nav className="navbar navbar-light">
            <div className="container">
                <Link className="navbar-brand" to="/">conduit</Link>

                <ul className="nav navbar-nav pull-xs-right">
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink>
                    </li>

                    {
                        isAuthenticated &&
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/editor">
                                <i className="ion-compose"></i>&nbsp;New Post
                            </NavLink>
                        </li>
                    }

                    {
                        isAuthenticated &&
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/settings">
                                <i className="ion-gear-a"></i>&nbsp;Settings
                            </NavLink>
                        </li>
                    }

                    {
                        !isAuthenticated &&
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/login">Sign in</NavLink>
                        </li>
                    }

                    {
                        !isAuthenticated &&
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/register">Sign up</NavLink>
                        </li>
                    }

                    {
                        isAuthenticated &&
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to={`/@${props.currentUser.username}`}>
                                {props.currentUser.username}
                            </NavLink>
                        </li>
                    }
                </ul>
            </div>
        </nav>
    );
};

export default withAuthenticatedUser(Navigation);