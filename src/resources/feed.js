import request from '../services/request';


const resource = 'articles/feed';
function getList(queryParameters) {
    return request(`${resource}`, {
        method: 'GET',
        queryParameters: queryParameters
    });
}

export const feedResource = {
    getList: getList
};