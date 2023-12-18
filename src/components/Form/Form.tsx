import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';


import './Form.css';
import {IPost} from "../../models/post";
import {addPost, fetchPost, updatePost} from "../../utils/api";
import {convertBase64} from "../../utils/helper";
import {useNavigate, useParams} from "react-router-dom";
import ImageTag from "./ImageTag/ImageTag";
import posts from "../Posts/Posts";

interface IFormProps {
    onAddPost: () => void
}

const Form: React.FC = memo(() => {
// const Form: React.FC<IFormProps> = memo(({onAddPost}) => {
// const Form: React.FC<IFormProps> = ({onAddPost}) => {

    console.log('<Form/>');

    const [postData, setPostData] = useState<IPost>({
            title: '',
            message: '',
            image: '',
            tags: []
        }
    );

    const tagInputRef = useRef<HTMLInputElement>(null);
    const imageFileInputRef = useRef<HTMLInputElement>(null);

    const params = useParams();
    const navigate = useNavigate();
    const id = params.id ? params.id : null;

    useEffect(() => {
        const fetchPostDetail = async (id: string) => {
            const fetchPostData = await fetchPost(id);
            setPostData(fetchPostData.data);
            if (fetchPostData.data.tags!.length > 0) {
                tagInputRef.current!.value = fetchPostData.data.tags!.join(',');
            }
        };

        if (id !== null) {
            fetchPostDetail(id);
        }
    }, [id])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('files', postData);
        if (!postData._id) {
            await addPost(postData);
        } else {
            await updatePost(postData._id, {
                _id: postData._id,
                title: postData.title,
                message: postData.message,
                tags: postData.tags,
                image: postData.image
            });
        }
        resetForm();
        navigate('/');

        // addPost(postData).then(() => onAddPost());
    }

    const handleReset = (e: React.FormEvent) => {
        resetForm();
    }

    const resetForm = () => {
        tagInputRef.current!.value = '';
        imageFileInputRef.current!.type = 'text';
        imageFileInputRef.current!.type = 'file';
        imageFileInputRef.current!.files = null;
        // imageFileInputRef.current.
        setPostData({
            title: '',
            message: '',
            image: '',
            tags: []
        });
    }

    const handleRemoveImage = useCallback(() => {
        setPostData((prevData) => {
            return {...prevData, image: ''};
        });
        imageFileInputRef.current!.type = 'text';
        imageFileInputRef.current!.type = 'file';
        imageFileInputRef.current!.files = null;
    }, []);


    return (
        <div className="memories_form-content">
            <h1>Creating a Memory</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={postData.title}
                       onChange={(e) => setPostData({...postData, title: e.target.value})}/>
                <textarea value={postData.message}
                          onChange={(e) => setPostData({...postData, message: e.target.value})}/>
                <input type="text" placeholder="Tags" ref={tagInputRef}
                       onChange={(e) => setPostData({...postData, tags: e.target.value.split(',')})}/>
                <input type="file" name="image" ref={imageFileInputRef}
                       onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                           const base64 = await convertBase64(e.currentTarget.files ? e.currentTarget.files[0] : '') as string;
                           setPostData({...postData, image: base64})
                       }}/>
                {postData.image.length > 0 && <ImageTag src={postData.image} onDelete={handleRemoveImage}/>}
                <button type="submit" className="active">Submit</button>
                <button type="button" onClick={handleReset}>clear</button>
            </form>
        </div>
    );
});

export default Form;