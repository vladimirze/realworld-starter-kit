const JWT_KEY_NAME = 'conduit-jwt';
let token;

export const jwt = {
    set(value) {
        token = value;
        localStorage.setItem(JWT_KEY_NAME, value);
    },

    get() {
        if (token) {
            return token;
        } else {
            token = localStorage.getItem(JWT_KEY_NAME);
            return token;
        }
    },

    remove() {
        token = undefined;
        localStorage.removeItem(JWT_KEY_NAME);
    },

    isSet() {
        return this.get() !== null;
    }
};
