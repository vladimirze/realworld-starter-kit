import config from './config';


export class APIError extends Error {
    constructor(statusCode, response, ...params) {
        super(...params);

        this.statusCode = statusCode;
        this.response = response;
    }
}

// could be rewritten as interceptor
function prepareBody(requestOptions) {
    const options = {...requestOptions};

    if (!options.headers || !options.headers['Content-type']) {
        return requestOptions;
    }

    switch (options.headers['Content-type']) {
        case 'application/json':
            options.body = JSON.stringify(options.body);
            break;

        default:
            break;
    }

    return options;
}

const interceptors = [];
export function addRequestInterceptor(func) {
    interceptors.push(func);
}

const responseInterceptors = [];
export function addResponseInterceptor(func) {
    responseInterceptors.push(func);
}

// TODO: add ability to cancel requests?
// addRequestInterceptor((resource, options, cancelFn) => {
//     if (resource.startsWith('http://')) {
//         cancelFn();
//     }
// });

function applyRequestInterceptors(requestUrl, requestOptions) {
    return interceptors.reduce((request, interceptor) => {
        const [url, options] = request;
        return interceptor(url, options);
    }, [requestUrl, requestOptions]);
}

// TODO: is there a chance a different component will be instantiated  before the previous is unmounted?
// ^and cause the unintended request to be canceled?
export const abortController = new AbortController();

export default function request(resource, options) {

    const defaultOptions = {
        headers: {'Content-type': 'application/json'},
        mode: 'cors',
        signal: abortController.signal
    };

    let requestOptions = Object.assign({}, defaultOptions, options);
    requestOptions = prepareBody(requestOptions);

    let requestUrl = `${config.API_BASE_URL}/${resource}`;
    if (interceptors.length > 0) {
        [requestUrl, requestOptions] = applyRequestInterceptors(requestUrl, requestOptions);
    }

    // response.ok is true when status code is between 200-299
    let responseClone;
    return fetch(requestUrl, requestOptions)
        .then((response) => {
            if (responseInterceptors.length > 0) {
                for (const interceptor of responseInterceptors) {
                    response = interceptor(response);
                }
            }
            return response;
        })
        .then((response) => {
            responseClone = response.clone();
            return responseClone.json();
        })
        .then((json) => {
            if (responseClone.ok) {
                return json;
            } else {
                throw new APIError(responseClone.status, json);
            }
        });
}
