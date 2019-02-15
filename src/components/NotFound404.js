import React, {Fragment} from 'react';


const NotFound404 = (props) => {
    return (
        <Fragment>
            {
                props.isShown &&
                <div className="container page">
                    <div className="row">
                        <div className="col-md-10 offset-md-1 col-xs-12">
                            <div className="alert alert-warning" role="alert">
                                Not Found
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                !props.isShown &&
                props.children
            }
        </Fragment>
    );
};

export default NotFound404;

