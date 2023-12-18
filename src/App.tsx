import React, {useEffect, useState} from 'react';
import './App.css';
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import authProvider, {initializeApp, guestCheckLoader, authCheckLoader, mainRootLoader} from "./utils/auth";
import Posts from "./components/Posts/Posts";
import Form from "./components/Form/Form";
import RootLayout from "./pages/RootLayout";
import AuthenticationPage from "./pages/AuthenticationPage";
import SignUpPage from "./pages/SignUpPage";
import PostsRoot from "./pages/Posts/PostsRoot";
import PostsPage from "./pages/Posts/PostsPage";
import AddPost from "./pages/Posts/AddPost";
import EditPost from "./pages/Posts/EditPost";

if (typeof window !== 'undefined') { // Check if we're running in the browser.
    // ✅ Only runs once per app load
    console.log('app called');
}


function App() {
    console.log('<App/>');
    const [isInitComplete, setIsInitComplete] = useState<boolean>(false);

    useEffect(() => {
        const initApp = async () => {
            await initializeApp();
            setIsInitComplete(true);
            console.log('--- after init auth provider', authProvider);
        }
        initApp();
    }, []);

    if (!isInitComplete) {
        return (<h1>Loading application</h1>);
    }

    const router = getRouter();

    return (<RouterProvider router={router}/>);
}

export default App;

function getRouter() {
    return createBrowserRouter([
        {
            id: 'root',
            path: '/',
            element: <RootLayout/>,
            loader: mainRootLoader,
            shouldRevalidate: (arg) => {
                // console.log('arg', arg);
                return true;
            },
            children: [
                {index: true, element: <Posts/>},
                {path: 'login', element: <AuthenticationPage/>, loader: guestCheckLoader},
                {path: 'signup', element: <SignUpPage/>, loader: guestCheckLoader},
                {
                    path: 'logout', loader: authCheckLoader, action() {
                        authProvider.signOut();
                        return redirect('/');
                    }
                },
                {
                    path: 'posts/',
                    Component: PostsRoot,
                    loader: authCheckLoader,
                    children: [
                        {index: true, element: <PostsPage/>},
                        {path: 'add', element: <AddPost/>},
                        {path: ':id', element: <EditPost/>},
                    ]
                },
            ],
            // errorElement: <ErrorContent/>
        },
    ]);
}
