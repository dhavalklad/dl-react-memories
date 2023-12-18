import './Header.css';
import memory from "../../images/memories.png";
import React, {memo} from "react";
import {Form, Link, NavLink, useRouteLoaderData} from "react-router-dom";
import {IAuthData} from "../../models/auth";

const Header: React.FC = memo(() => {
    console.log('<Header/>');
    const {user} = useRouteLoaderData('root') as { user: IAuthData | null };
    return (
        <div className="memories_container-appbar">
            <div className="memories_container-appbar_title">
                <h1>Memories</h1>
                <img src={memory} alt="memory"/>
            </div>
            <div className="memories_container-appbar_actions">
                {!user && <><NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Sign
                    In</NavLink>
                    <NavLink to="/signup" className={({isActive}) => isActive ? 'active' : undefined}>Sign
                        Up</NavLink> </>}
                {user &&
                    <Form action="/logout" method="post">
                        <button className="memories_container-appbar_actions-logout">Logout</button>
                    </Form>}
            </div>
        </div>
    );
});

export default Header;