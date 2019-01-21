import request from "./request";


function get(username) {
    const req = request(`profiles/${username}`, {
        method: 'GET'
    });

    req.promise = req.promise.then((profile) => {
        return profile.profile;
    });

    return req;
}

export const profileService = {
    get: get
};