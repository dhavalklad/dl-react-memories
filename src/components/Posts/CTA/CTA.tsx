import React, {ChangeEvent, useEffect, useState} from 'react';


// import './Login.css';
import {Link} from "react-router-dom";
import searchIcon from "../../../images/magnifying-glass.png";
import './CTA.css';


interface ICTAProps {
    onSearchChange: (searchString: string) => void
}

const CTA: React.FC<ICTAProps> = ({onSearchChange}) => {
    console.log('<CTA/>');
    // const [suggestions, setSuggestions] = useState<string[]>([]);
    // const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    // const [searchString, setSearchString] = useState<string>('');

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         console.log('search called');
    //         // fetch posts
    //         // onSearch(searchString);
    //     }, 500);
    //     return () => {
    //
    //         clearTimeout(timeout)
    //     }
    // }, [searchString]);


    return (
        <div className="memories_container-content_actions">
            <div className="memories_container-content_actions-search_wrapper">
                <div className="memories_container-content_actions-search">
                    <input type="text" placeholder="Search"
                           onChange={(e) => {
                               onSearchChange(e.target.value);
                           }}
                    />
                    <button><img src={searchIcon}/></button>
                </div>

            </div>
            <div className="memories_container-content_actions-add">
                <p><Link to="/posts/add">Add Post</Link></p>
            </div>

        </div>
    );
};

export default CTA;
