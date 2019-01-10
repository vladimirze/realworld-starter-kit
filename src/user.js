import request from './request';

const resource = 'user';
function getCurrentUser() {
    return request(resource, {
        method: 'GET'
    });
}

const user = {
    getCurrentUser: getCurrentUser
};

export default user;