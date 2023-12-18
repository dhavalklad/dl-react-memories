import React, {memo, useRef, useState} from 'react';


import './SignUp.css';
import {Link, useNavigate} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import authProvider from "../../utils/auth";
import {abortController, signUp, validateUserEmail} from "../../utils/api";
import form from "../Form/Form";

interface ISignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUp: React.FC = () => {
    console.log('<SignUpPage/>');
    const {
        register,
        formState: {errors, isSubmitting, isValidating},
        handleSubmit,
        trigger
    } = useForm<ISignUpForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        mode: "onTouched"
    });
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<ISignUpForm> = async (formData) => {
        console.log('signup form data', formData);
        try {
            const {data} = await signUp(formData);
            authProvider.setAuthData({token: data.data.token, expiresAt: data.data.expiresAt, userId: data.data.user.id!});
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
        <div className="memories_signup_form-content">
            <div className="memories_login_form-title">
                <h1>Sign up!</h1>
                <p>Please fill below information to get started.</p>
            </div>
            <div className="memories_login_form-container">
                {serverError && <p className="alert">{serverError}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-row">
                        <div className="input">
                            <label>First Name</label>
                            <input type="text" placeholder="First name" {...register('firstName', {
                                required: {
                                    value: true,
                                    message: "First Name is required"
                                }
                            })}/>
                            {errors.firstName?.message && (
                                <p className="alert" role="alert">{errors.firstName?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <label>Last Name</label>
                            <input type="text" placeholder="Last name" {...register('lastName', {
                                required: {
                                    value: true,
                                    message: "Last Name is required"
                                }
                            })}/>
                            {errors.lastName?.message && (
                                <p className="alert" role="alert">{errors.lastName?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <label>Email</label>
                            <input type="email" placeholder="Email" {...register('email', {
                                pattern: {
                                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    message: "Invalid email address"
                                },
                                required: {
                                    value: true,
                                    message: "Email is required"
                                },
                                validate: {
                                    uniqueEmail: async (value) => {
                                        console.log('unique email validation called');
                                        if (value.length === 0) {
                                            return true;
                                        }
                                        const validateEmailResponse = await validateUserEmail(value);
                                        return validateEmailResponse.data.data.isEmailExist === false || "Email already exists";
                                    }
                                }
                            })}/>
                            {errors.email?.message && (
                                <p className="alert" role="alert">{errors.email?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <label>Password</label>
                            <input type="password" placeholder="Password" {...register('password', {
                                required: {
                                    value: true,
                                    message: "Password is required"
                                },
                                validate: {
                                    shouldMatchPassword: (value, formValues) => {
                                        if (formValues.password.length > 0 && value.length > 0) {
                                            trigger('confirmPassword');
                                        }
                                        return true;
                                    }
                                }
                            })}/>
                            {errors.password?.message && (
                                <p className="alert" role="alert">{errors.password?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input">
                            <label>Confirm Password</label>
                            <input type="password"
                                   placeholder="Confirm Password" {...register('confirmPassword', {
                                required: {
                                    value: true,
                                    message: "Confirm password is required"
                                }, validate: {
                                    shouldMatchPassword: (value, formValues) => {
                                        if (formValues.password.length > 0 && value.length > 0 && formValues.password !== value) {
                                            return "Confirm password should match Password.";
                                        }
                                        return true;
                                    }
                                }
                            })}/>
                            {errors.confirmPassword?.message && (
                                <p className="alert" role="alert">{errors.confirmPassword?.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="memories_login_form-container_button">
                        <button type="submit"
                                disabled={isSubmitting || isValidating}>{isSubmitting ? 'Processing...' : 'Sign in'}</button>
                    </div>
                </form>
            </div>
            <div className="memories_login_form-signup_action">
                <p>Already Registered? <Link to="/login">Please click here for Sign in</Link></p>
            </div>
        </div>
    );
};

export default SignUp;