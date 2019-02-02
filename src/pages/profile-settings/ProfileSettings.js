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

    updateSettings(event) {
        event.preventDefault();

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
            <div className="settings-page">
                <div className="container page">
                    <div className="row">

                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Your Settings</h1>

                            <form>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input className="form-control"
                                               type="text"
                                               placeholder="URL of profile picture"
                                               name="image"
                                               value={this.state.user.image}
                                               onChange={this.handleInputChange}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg"
                                               type="text"
                                               placeholder="Your Name"
                                               name="username"
                                               value={this.state.user.username}
                                               onChange={this.handleInputChange}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <textarea className="form-control form-control-lg"
                                                  rows="8"
                                                  placeholder="Short bio about you"
                                                  name="bio"
                                                  value={this.state.user.bio}
                                                  onChange={this.handleInputChange}></textarea>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg"
                                               type="text"
                                               placeholder="Email"
                                               name="email"
                                               value={this.state.user.email}
                                               onChange={this.handleInputChange}/>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg"
                                               type="password"
                                               placeholder="Password"
                                               name="password"
                                               value={this.state.user.password}
                                               onChange={this.handleInputChange}/>
                                    </fieldset>

                                    <button className="btn btn-lg btn-primary pull-xs-right"
                                            onClick={this.updateSettings}>
                                        Update Settings
                                    </button>
                                </fieldset>
                            </form>

                            <hr/>

                            <button className="btn btn-outline-danger" onClick={this.logOut}>
                                Or click here to logout.
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
export default withAuthenticatedUser(ProfileSettings);