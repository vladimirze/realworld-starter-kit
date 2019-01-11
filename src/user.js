import request from './request';
import Observable from './Observable';
import jwt from './jwt';


const resource = 'user';
const currentUser = new Observable();
const isAuthenticated = new Observable(!!jwt.get());

function getCurrentUser() {
    return request(resource, {
        method: 'GET'
    })
    .then((authenticatedUser) => {
        currentUser.notify(authenticatedUser);
        return authenticatedUser;
    });
}

const user = {
    getCurrentUser: getCurrentUser,
    currentUser: currentUser,
    isAuthenticated: isAuthenticated
};

export default user;
