import React, {ReactNode} from 'react';


import './Error.css';

interface IErrorContentProps {
    title: string;
    children: ReactNode
}


const ErrorContent: React.FC<IErrorContentProps> = ({title, children}) => {
    console.log('<ErrorContent/>');

    return (
        <div className="memories_error-content">
            <h1>{title}</h1>
            {children}
        </div>
    );
};
export default ErrorContent;
// export default ErrorContent;