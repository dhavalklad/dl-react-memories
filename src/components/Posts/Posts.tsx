import React, {useCallback, useEffect, useState} from 'react';
import Post from "./Post/Post";
import {IPost} from "../../models/post";
import {fetchPosts} from "../../utils/api";
import {Link, useRouteLoaderData} from "react-router-dom";

import './Posts.css';
import searchIcon from '../../images/magnifying-glass.png';
import CTA from "./CTA/CTA";
import {IUser} from "../../models/user";
import auth from "../../utils/auth";
import {IAuthData} from "../../models/auth";

// interface IPostProps {
//     posts: IPost[],
//     isFetching: boolean
// }

// const Posts: React.FC<IPostProps> = ({posts,isFetching}) => {
const Posts: React.FC = () => {
    console.log('<Posts/>');

    const [posts, setPosts] = useState<IPost[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>('');
    const {user} = useRouteLoaderData('root') as { user: IAuthData | null };

    const handleOnDelete = (id: string): void => {
        setPosts(posts.filter((post: IPost): boolean => post._id !== id));
    }

    const handleOnSearchChange = (value: string) => setSearchString(value);

    //
    // let loadResult: boolean = true;
    useEffect(() => {
        setIsFetching(true);
        //create async function
        const fetchData = async () => {
            const res = await fetchPosts(searchString);
            setIsFetching(false);
            // if (loadResult) {
            setPosts(res.data.data);
            // }
        }

        const timeOut = setTimeout(() => {
            fetchData();
        }, 500)

        return () => {
            // loadResult = false
            clearTimeout(timeOut);
        };
    }, [searchString]);

    return (
        <>
            <div className="memories_container-content section__margin">
                {!user &&
                    <div className="memories_container-content_info-text"><h1 className="info-text">Please Sign In to
                        create your own memories and like other's memories.</h1></div>}
                {user && <CTA onSearchChange={handleOnSearchChange}/>}
                {isFetching &&
                    <div className="memories_container-content_info-text"><h1>Fetching Memories...</h1></div>}

                {!isFetching && posts.length > 0 &&
                    <div className="memories_container-content_post_container_list">
                        {posts.map((post: IPost) => {
                            return (<Post post={post} key={post._id} authUser={user} onDeletePost={handleOnDelete}/>);
                        })}
                    </div>}
                {!isFetching && posts.length === 0 &&
                    <div className="memories_container-content_info-text"><h1>No data available</h1></div>
                }
            </div>
        </>
    );
}

export default Posts;