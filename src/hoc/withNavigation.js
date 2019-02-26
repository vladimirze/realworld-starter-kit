import React from 'react';
import {withRouter} from "react-router-dom";
import {navigation} from "../services/navigation";


function provideNavigation(WrappedComponent) {
    return (props) => {
        const boundNavigation = {
            search: navigation.search.bind(navigation, props.location),
            updateQueryParams: navigation.updateQueryParams.bind(navigation, props.history, props.location),
            getQueryParams: navigation.getQueryParams.bind(navigation, props.location),
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

/*
    TODO: Home Page bug with navigation
        - select tag
        - click on conduit logo
        - the query params will disappear (which is OK) but the state will remain in selected tag
 */