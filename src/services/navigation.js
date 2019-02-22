function search(location, toPath, queryParams, shouldPreserveQueryParams=true) {
    const currentQueryParams = new URLSearchParams(location.search);

    let updatedQueryParams = {};
    if (shouldPreserveQueryParams) {
        for (const key of currentQueryParams.keys()) {
            updatedQueryParams[key] = currentQueryParams.get(key);
        }
    }

    return (toPath || location.pathname) + '?' + new URLSearchParams(Object.assign(updatedQueryParams, queryParams)).toString();
}

function updateQueryParams(history, location, queryParam) {
    history.push(search(location, location.pathname, queryParam));
}

export default {search, updateQueryParams};