import request from './request';
import Observable from './Observable';


const resource = 'user';
const currentUser = new Observable();

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
    currentUser: currentUser
};

export default user;
