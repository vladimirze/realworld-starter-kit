import request from './request';
import jwt from './jwt';
import user from './user';

// TODO: append jwt token to each request
// TODO: handle the case when token is expired
const resource = 'users';

function register(username, email, password) {
    return request(resource, {
        method: 'POST',
        body: {user: {username: username, email: email, password: password}}
    });
}

function logIn(email, password) {
    return request(`${resource}/login`, {
        method: 'POST',
        body: {user: {email: email, password: password}}
    })
    .then((authenticatedUser) => {
        jwt.set(authenticatedUser.user.token);
        user.isAuthenticated.notify(true);
        return authenticatedUser;
    });
}

// TODO: it's better reset the state by navigating the browser back to log-in page after deleting the token
function logOut() {
    jwt.remove();
    user.isAuthenticated.notify(false);
    window.location.href = '/';
    return Promise.resolve(true);
}

const users = {
    register: register,
    logIn: logIn,
    logOut: logOut,

};

export default users;