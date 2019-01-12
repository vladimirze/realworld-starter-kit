import request from './request';
import Observable from './Observable';
import jwt from './jwt';


const currentUser = new Observable();
const isAuthenticated = new Observable(!!jwt.get());

function getCurrentUser() {
    const req = request('user', {
        method: 'GET'
    });

    req.promise = req.promise.then((authenticatedUser) => {
        currentUser.notify(authenticatedUser);
        return authenticatedUser;
    });

    return req;
}

// TODO: handle the case when token is expired
function register(username, email, password) {
    return request('users', {
        method: 'POST',
        body: {user: {username: username, email: email, password: password}}
    });
}

function logIn(email, password) {
    const req = request('users/login', {
        method: 'POST',
        body: {user: {email: email, password: password}}
    });

    req.promise = req.promise.then((authenticatedUser) => {
        jwt.set(authenticatedUser.user.token);
        user.isAuthenticated.notify(true);
        return authenticatedUser;
    });

    return req;
}

// TODO: can jwt token be invalidated after user logs out? (backend)
function logOut() {
    jwt.remove();
    user.isAuthenticated.notify(false);
    window.location.href = '/';
    return Promise.resolve(true);
}


const user = {
    getCurrentUser: getCurrentUser,
    currentUser: currentUser,
    isAuthenticated: isAuthenticated,
    register: register,
    logIn: logIn,
    logOut: logOut
};

export default user;
