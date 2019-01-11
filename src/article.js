import request from './request';


const resource = 'articles';
function getList(limit=10, offset=0) {
    return request(`${resource}?limit=${limit}&offset=${offset}`, {
        method: 'GET'
    });
}

export const article = {
    getList: getList
};