import {Component, Fragment} from "react";
import user from "../../resources/user";
import React from "react";
import withAuthenticatedUser from "../../components/withAuthenticatedUser";

class ProfileSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this._getDefaultUserSettings()
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    handleInputChange(event) {
        const user = {...this.state.user, [event.target.name]: event.target.value};
        this.setState({user: user});
    }

    updateSettings() {
        const updatedUser = {...this.state.user};
        if (updatedUser.password.length === 0) {
            delete updatedUser.password;
        }

        this.request = user.update(updatedUser);
        this.request.promise
            .catch(console.error);
    }

    logOut() {
        user.logOut();
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    _getDefaultUserSettings() {
        return {
                image: this.props.currentUser.image || '',
                email: this.props.currentUser.email || '',
                bio: this.props.currentUser.bio || '',
                username: this.props.currentUser.username || '',
                password: ''
        };
    }

    componentDidUpdate(prevProps) {
        // currentUser is not available immediately when constructor() is called. This set's the fields
        // another way to solve it is to set key on in the withAuthenticatedUser
        if ((Object.keys(prevProps.currentUser).length === 0) && (Object.keys(this.props.currentUser).length > 0)) {
            this.setState({
                user: this._getDefaultUserSettings()
            });
        }
    }

    render() {
        return (
            <Fragment>
                <h1>Your Settings</h1>
            <div>
                <input
                    type="text"
                    placeholder="URL of profile picture"
                    name="image"
                    value={this.state.user.image}
                    onChange={this.handleInputChange}/>

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={this.state.user.username}
                    onChange={this.handleInputChange}/>

                <textarea
                    placeholder="Bio"
                    name="bio"
                    value={this.state.user.bio}
                    onChange={this.handleInputChange}>
                </textarea>

                <input
                    type="text"
                    placeholder="email"
                    name="email"
                    value={this.state.user.email}
                    onChange={this.handleInputChange}/>

                <input
                    type="password"
                    name="password"
                    value={this.state.user.password}
                    onChange={this.handleInputChange}/>


                <button onClick={this.updateSettings}>Update Settings</button>
                <button onClick={this.logOut}>Log Out</button>
            </div>
            </Fragment>
        );
    }
}
export default withAuthenticatedUser(ProfileSettings);