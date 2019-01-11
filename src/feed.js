import request from './request';


const resource = 'articles/feed';
function getList(limit=10, offset=0) {
    return request(`${resource}?limit=${limit}&offset=${offset}`, {
        method: 'GET'
    });
}

export const feed = {
    getList: getList
};