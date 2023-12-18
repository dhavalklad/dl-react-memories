import React, {ReactNode} from 'react';
import './Post.css';
import sample from '../../../images/sample1.jpg'
import moment from "moment/moment";
import {IPost} from "../../../models/post";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {deletePost} from "../../../utils/api";
import {IUser} from "../../../models/user";
import {IAuthData} from "../../../models/auth";

interface IPostCardProps {
    post: IPost,
    authUser: IAuthData | null
    onDeletePost: (id: string) => void
}

const Post: React.FC<IPostCardProps> = ({post, onDeletePost, authUser}) => {
    console.log('<Post/>');
    const navigate: NavigateFunction = useNavigate();

    const showActions = authUser !== null;

    const handlePostDelete = async () => {
        const confirmMsg: string = "Are you sure you want to delete?";
        if (window.confirm(confirmMsg)) {
            const deleteResponse = await deletePost(post._id as string);
            if (deleteResponse.status === 200) {
                onDeletePost(post._id as string);
            }
        }
    }

    return (
        <div className="memories_container-content_post_container_list-content">
            <div className="memories_post-image">
                <img src={post.image}/>
                <div className="memories_post-image_title">
                    <div className="memories_post-image_title-name">
                        <h1>{post.created_by?.firstName}</h1>
                        <p>{moment(post.created_at).fromNow()}</p>
                    </div>
                    {showActions && <button className="memories_post-image_title-overflow"
                                            onClick={() => navigate(`posts/` + post._id, {relative: 'path'})}>Edit
                    </button>}
                </div>
            </div>
            <div className="memories_post-content pad">
                <p>{post.tags?.map((tag) => '#' + tag).join(', ')}</p>
                <h1>{post.title}</h1>
                {/*<p>Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing.*/}
                {/*    Indulgence way everything joy alteration boisterous the attachment. Party we years to order allow*/}
                {/*    asked of.</p>*/}
                <p>{post.message}</p>
                {showActions && <div className="memories_post-content_action">
                    <div>
                        <button>Like</button>
                        {'   '}<span>7</span></div>
                    {post.creator === authUser?.userId && <button onClick={handlePostDelete}>Delete</button>}
                </div>}
            </div>

        </div>
    );
}

export default Post;