import React from "react";
import {Outlet} from "react-router-dom";

const PostsRoot: React.FC = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
}

export default PostsRoot;