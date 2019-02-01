import {Component} from "react";
import {profileResource} from "../../resources/profile";
import {Link} from "react-router-dom";
import withAuthenticatedUser from "../../components/withAuthenticatedUser";
import React from "react";


class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {}
        };
    }

    isOwner() {
        return this.props.currentUser.username === this.props.match.params.user;
    }

    componentDidMount() {
        this.request = profileResource.get(this.props.match.params.user);
        this.request.promise
            .then((profile) => {
                this.setState({profile: profile});
            })
            .catch(console.error);
    }

    componentWillUnmount() {
        if (this.request) {
            this.request.abort();
        }
    }

    render() {
        return (
            <div>
                {this.props.match.params.user} Profile.
                {this.state.profile.bio}
                {this.isOwner() && <Link to="/settings">Edit Profile Settings</Link>}
            </div>
        )
    }
}
export default withAuthenticatedUser(UserProfile);