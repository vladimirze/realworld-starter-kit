import request from '../services/request';
import Observable from '../services/Observable';
import {jwt} from '../services/jwt';

export const authenticationStatusEnum = {
    AUTHENTICATED: 'authenticated',
    NOT_AUTHENTICATED: 'not_authenticated',
    IN_PROGRESS: 'in_progress'
};

const currentUser = new Observable();
const authenticationStatus = new Observable(
    jwt.isSet() ?
    authenticationStatusEnum.IN_PROGRESS :
    authenticationStatusEnum.NOT_AUTHENTICATED
);

function getCurrentUser() {
    const req = request('user', {
        method: 'GET'
    });

    req.promise = req.promise.then((authenticatedUser) => {
        const user = authenticatedUser.user;

        currentUser.notify(user);
        authenticationStatus.notify(authenticationStatusEnum.AUTHENTICATED);

        return user;
    })
    .catch((error) => {
        authenticationStatus.notify(authenticationStatusEnum.NOT_AUTHENTICATED);
        throw error;
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
        authenticationStatus.notify(authenticationStatusEnum.AUTHENTICATED);
        currentUser.notify(authenticatedUser.user);
        return authenticatedUser;
    });

    return req;
}

function logOut() {
    jwt.remove();
    userResource.authenticationStatus.notify(authenticationStatusEnum.NOT_AUTHENTICATED);
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
    authenticationStatus: authenticationStatus,
    register: register,
    logIn: logIn,
    logOut: logOut,
    update: update
};

export default userResource;
