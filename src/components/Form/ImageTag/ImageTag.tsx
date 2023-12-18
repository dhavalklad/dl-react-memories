import React, {memo, useRef, useState} from 'react';


import './ImageTag.css';
import remove from "../../../images/remove.png";


interface IPostImage {
    src: string,
    onDelete: () => void
}

const ImageTag: React.FC<IPostImage> = memo(({src, onDelete}) => {
    console.log('<ImageTag/>');

    return (
        <div className="memories_form-img_tag">
            <img src={src} alt="memory"/>
            <button className="memories_form-img_tag_delete" onClick={() => onDelete()}><img src={remove} alt="delete"/>
            </button>
        </div>
    );
});

export default ImageTag;