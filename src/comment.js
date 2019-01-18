import request from './request';


function getList(articleSlug) {
    return request(`articles/${articleSlug}/comments`, {
        method: 'GET'
    });
}

function create(articleSlug, comment) {
    return request(`articles/${articleSlug}/comments`, {
        method: 'POST',
        body: {comment: {body: comment}}
    });
}

function remove(articleSlug, commentId) {
    return request(`articles/${articleSlug}/comments/${commentId}`, {
        method: 'DELETE'
    });
}

function isAuthor(user, comment) {
    return user.username === comment.author.username;
}


export const commentService = {
    create: create,
    getList: getList,
    remove: remove,
    isAuthor: isAuthor
};