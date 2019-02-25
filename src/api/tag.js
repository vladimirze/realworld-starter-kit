import request from '../services/request';


function getList() {
    return request('tags', {
        method: 'GET'
    });
}

export const tagResource = {
    getList: getList
};