import request from './request';


const resource = 'articles/feed';
function getList(queryParameters) {
    return request(`${resource}`, {
        method: 'GET',
        queryParameters: queryParameters
    });
}

export const feed = {
    getList: getList
};