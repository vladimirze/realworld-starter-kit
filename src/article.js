import request from './request';


const resource = 'articles';
function getList(limit=10, offset=0) {
    return request(`${resource}?limit=${limit}&offset=${offset}`, {
        method: 'GET'
    });
}

function get(slug) {
    return request(`${resource}/${slug}`, {
        method: 'GET'
    });
}

function update(slug, changes) {
    return request(`${resource}/${slug}`, {
        method: 'PUT',
        body: {article: changes}
    });
}

function create(article) {
    return request(`${resource}`, {
        method: 'POST',
        body: {article: article}
    });
}

function remove(slug) {
    return request(`${resource}/${slug}`, {
        method: 'DELETE'
    });
}

export const articleService = {
    getList: getList,
    get: get,
    update: update,
    create: create,
    remove: remove
};