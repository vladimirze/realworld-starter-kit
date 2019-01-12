export const marker = {
    PREVIOUS: '<',
    BETWEEN: '...',
    NEXT: '>'
};

export function paginate(page, total, limit) {
    // paginate(page=1, total=100, limit=10)
    // [1, 2, 3, 4, 5, marker.BETWEEN, 100]
}

export function getOffset(page, limit) {
    return (limit * page) - limit;
}