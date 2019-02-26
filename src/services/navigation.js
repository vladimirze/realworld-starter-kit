export const navigation = {
    search(location, toPath, queryParams, {preserveQueryParams = true} = {}) {
        const currentQueryParams = new URLSearchParams(location.search);

        let updatedQueryParams = {};
        if (preserveQueryParams) {
            for (const key of currentQueryParams.keys()) {
                updatedQueryParams[key] = currentQueryParams.get(key);
            }
        }

        return (toPath || location.pathname) + '?' + new URLSearchParams(Object.assign(updatedQueryParams, queryParams)).toString();
    },

    updateQueryParams(history, location, queryParam, options) {
        history.push(this.search(location, location.pathname, queryParam, options));
    },

    getQueryParams(location) {
        const queryParams = {};
        const searchParams = new URLSearchParams(location.search);

        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });

        return queryParams;
    },

    go(history, ...args) {
        history.push.apply(history, args);
    }
};
