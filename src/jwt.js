const JWT_KEY_NAME = 'conduit-jwt';

let token;

function set(value) {
    token = value;
    localStorage.setItem(JWT_KEY_NAME, value);
}

function get() {
    if (token) {
        return token;
    } else {
        token = localStorage.getItem(JWT_KEY_NAME);
        return token;
    }
}

function remove() {
    token = undefined;
    localStorage.removeItem(JWT_KEY_NAME);
}


const jwt = {set: set, get: get, remove: remove};
export default jwt;