import request from '../services/request';


const resource = 'articles';
function getList(queryParameters) {
    return request(`${resource}`, {
        method: 'GET',
        queryParameters: queryParameters
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

function favorite(slug) {
    return request(`${resource}/${slug}/favorite`, {
        method: 'POST'
    });
}

function unfavorite(slug) {
    return request(`${resource}/${slug}/favorite`, {
        method: 'DELETE'
    });
}

function isAuthor(article, user) {
    return article.author.username === user.username;
}

export const articleResource = {
    getList: getList,
    get: get,
    update: update,
    create: create,
    remove: remove,
    favorite: favorite,
    unfavorite: unfavorite,
    isAuthor: isAuthor
};