import React from "react";
import {useRouteError} from "react-router-dom";
import ErrorContent from "../components/Error/ErrorContent";

const ErrorPage: React.FC = () => {

    const error: any = useRouteError();

    let title: string = 'An error occurred!';
    let message: string = 'Something went wrong!';

    if (error.status === 500) {
        message = error?.data?.message;
    }

    if (error?.status === 404) {
        title = 'Not found!';
        message = 'Could not find resource or page.';
    }

    return (
        <ErrorContent title={title}>
            <p>{message}</p>
        </ErrorContent>
    );
}

export default ErrorPage;