import React from 'react';
import {withRouter} from "react-router-dom";
import {navigation} from "../services/navigation";


function provideNavigation(WrappedComponent) {
    return (props) => {
        const boundNavigation = {
            search: navigation.search.bind(navigation, props.location),
            updateQueryParams: navigation.updateQueryParams.bind(navigation, props.history, props.location),
            queryParams: navigation.getQueryParams(props.location),
            go: navigation.go.bind(navigation, props.history)
        };

        return (
            <WrappedComponent {...props} navigation={boundNavigation}/>
        );
    };
}

export default function withNavigation(WrappedComponent) {
    return withRouter(provideNavigation(WrappedComponent));
}
