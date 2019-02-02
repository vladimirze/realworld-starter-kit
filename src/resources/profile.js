import request from "../services/request";


function get(username) {
    const req = request(`profiles/${username}`, {
        method: 'GET'
    });

    req.promise = req.promise.then((profile) => {
        return profile.profile;
    });

    return req;
}

function follow(username) {
    return request(`profiles/${username}/follow`, {
        method: 'POST'
    });
}

function unfollow(username) {
    return request(`profiles/${username}/follow`, {
        method: 'DELETE'
    });
}

export const profileResource = {
    get: get,
    follow: follow,
    unfollow: unfollow
};