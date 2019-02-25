import request from '../services/request';
import Observable from '../services/Observable';
import {jwt} from '../services/jwt';


const currentUser = new Observable();
const isAuthenticated = new Observable(!!jwt.get());

function getCurrentUser() {
    const req = request('user', {
        method: 'GET'
    });

    req.promise = req.promise.then((authenticatedUser) => {
        const user = authenticatedUser.user;

        currentUser.notify(user);
        return user;
    });

    return req;
}

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
        userResource.isAuthenticated.notify(true);
        return authenticatedUser;
    });

    return req;
}

function logOut() {
    jwt.remove();
    userResource.isAuthenticated.notify(false);
    window.location.href = '/';
    return Promise.resolve(true);
}

function update(updatedUser) {
    const req = request('user', {
        method: 'PUT',
        body: {user: updatedUser}
    });

    req.promise = req.promise.then((authenticatedUser) => {
        const user = authenticatedUser.user;
        currentUser.notify(user);

        return user;
    });

    return req;
}

const userResource = {
    getCurrentUser: getCurrentUser,
    currentUser: currentUser,
    isAuthenticated: isAuthenticated,
    register: register,
    logIn: logIn,
    logOut: logOut,
    update: update
};

export default userResource;
