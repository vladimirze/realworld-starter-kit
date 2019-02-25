import {navigation} from "./navigation";
import React from "react";


export const pagination = {
    getCurrentPageNumber(location) {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('page')) {
            return parseInt(searchParams.get('page')) || 1;
        } else {
            return 1;
        }
    },

    getPageOffset(pageNumberOrLocation, maxItemsPerPage) {
        let pageNumber;
        if (Number.isInteger(pageNumberOrLocation)) {
            pageNumber = pageNumberOrLocation;
        } else {
            pageNumber = this.getCurrentPageNumber(pageNumberOrLocation);
        }

        return pageNumber * maxItemsPerPage - maxItemsPerPage;
    },

    getTotalPages(itemCount, maxItemsPerPage) {
        return Math.ceil(itemCount / maxItemsPerPage);
    },

    goPage(history, location, page) {
        navigation.updateQueryParams(history, location, {page: page});
    },

    paginate(location, totalPages, onPageClick) {
        const pageNumber = this.getCurrentPageNumber(location);
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
};
