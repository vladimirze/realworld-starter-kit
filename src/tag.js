import request from './request';


function getList() {
    return request('tags', {
        method: 'GET'
    });
}

export const tagService = {
    getList: getList
};