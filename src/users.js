import request from './request';
import jwt from './jwt';

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
    return request(`${users}/login`, {
        method: 'POST',
        body: {user: {email: email, password: password}}
    })
    .then((authenticatedUser) => {
        jwt.set(authenticatedUser.user.token);
        return authenticatedUser;
    });
}

function logOut() {
    jwt.remove();
    return Promise.resolve(true);
}

const users = {
    register: register,
    logIn: logIn,
    logOut: logOut,

};

export default users;