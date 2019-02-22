import navigation from "./navigation";
import React from "react";


function getCurrentPageNumber(location) {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('page')) {
        return parseInt(searchParams.get('page')) || 1;
    } else {
        return 1;
    }
}

function getPageOffset(pageNumberOrLocation, maxItemsPerPage) {
    let pageNumber;
    if (Number.isInteger(pageNumberOrLocation)) {
        pageNumber = pageNumberOrLocation;
    } else {
        pageNumber = getCurrentPageNumber(pageNumberOrLocation);
    }

    return pageNumber * maxItemsPerPage - maxItemsPerPage;
}

function getTotalPages(itemCount, maxItemsPerPage) {
    return Math.ceil(itemCount / maxItemsPerPage);
}

function goPage(history, location, page) {
    navigation.updateQueryParams(history, location, {page: page});
}

function paginate(location, totalPages, onPageClick) {
    const pageNumber = getCurrentPageNumber(location);
    const pages = [];

    for (let i = 1; i <= totalPages; i += 1) {
        pages.push(
            (
                <li className={`u-cursor page-item ${pageNumber === i ? 'active' : ''}`}
                    key={i}
                    onClick={() => {onPageClick(i)}}>
                    <span className="page-link">
                        {i}
                    </span>
                </li>
            )
        );
    }

    return (
        <ul className="pagination">
            {pages}
        </ul>
    );
}

export default {getCurrentPageNumber, getPageOffset, getTotalPages, goPage, paginate};
