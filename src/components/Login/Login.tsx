import React, {memo, useRef, useState} from 'react';


import './Login.css';
import {Link, redirect, useNavigate} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import authProvider from "../../utils/auth";
import {AxiosError} from "axios";

interface ILoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    console.log('<Login/>');

    const navigate = useNavigate();
    const {register, formState: {errors, isSubmitting}, handleSubmit} = useForm<ILoginForm>();
    const [serverError, setServerError] = useState<string | null>(null);

    const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
        console.log('login form data', data);

        try {
            await authProvider.signIn(data.email, data.password);
            navigate("/posts", {replace: true});
        } catch (e: any) {
            console.log('exception', e);
            let error = e.message;
            if (e.response) {
                error = e.response.data.message;
            }
            setServerError(error)
        }
    }

    return (
        <div className="memories_login_form-content">
            <div className="memories_login_form-title">
                <h1>Sign in!</h1>
                <p>Stay updated with your posts</p>
            </div>
            <div className="memories_login_form-container">
                {serverError && <p className="alert">{serverError}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-row">
                        <div className="input">
                            <label>Email</label>
                            <input type="email" {...register('email', {required: true})}/>
                            {errors.email?.type === "required" && (
                                <p className="alert" role="alert">Email is required</p>
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <label>Password</label>
                            <input type="password" {...register('password', {required: true})}/>
                            {errors.password?.type === "required" && (
                                <p className="alert">Password is required</p>
                            )}
                        </div>
                    </div>
                    <div className="memories_login_form-container_button">
                        <button type="submit"
                                disabled={isSubmitting}>{isSubmitting ? 'Signing In...' : 'Sign in'}</button>
                    </div>
                </form>
            </div>
            <div className="memories_login_form-signup_action">
                <p>Not Registered? <Link to="/signup">Please click here for Sign up</Link></p>
            </div>
        </div>
    );
};

export default Login;