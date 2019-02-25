import React from 'react';


function isEmptyObject(props) {
    return !props.errors || Object.keys(props.errors).length === 0;
}

export const ErrorViewer = (props) => {
    return (
        <div>
            {
                !isEmptyObject(props) &&
                <ul className="text-danger">
                    {
                        Object.keys(props.errors).map((errorKey) => {
                            return <li key={errorKey}>{errorKey}: {props.errors[errorKey]}</li>
                        })
                    }
                </ul>
            }
        </div>
    );
};
