import { getOffset, marker, paginate } from "./paginator";

/*
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
 */

// getOffset
it('should return correct offset', () => {
    expect(getOffset(1, 10)).toEqual(0);
    expect(getOffset(2, 10)).toEqual(10);
});

// paginate
it('should return list of pages', () => {
    expect(paginate()).toEqual();
});
// stackoverflow

/**
 * Example of how it should look like:
 *
    [1] 2 3 4 5 ... 4000 next
    1 ... 3 4 [5] 6 7 ... 4000 next
    prev 1 ... 3996 3997 3998 3999 4000
 */


/**
 * Usage example
 *
paginate(this.state.pageNumber, this.state.totalPages, this.state.limit).map((page) => {
    if (marker.PREVIOUS === page) {
        return <span>{page-1}</span>;
    } else if (marker.BETWEEN === page) {
        return <span>...</span>;
    } else if (marker.NEXT === page) {
        return <span>{page+1}</span>;
    } else {
        return <span>{page}</span>;
    }
});
 **/