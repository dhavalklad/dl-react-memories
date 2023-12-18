import axios, {AxiosHeaders} from "axios";
import {IPost} from "../models/post";
import authProvider from "./auth";
import {IUser} from "../models/user";
import {IAuthData} from "../models/auth";

const baseUrl: string = 'http://localhost:8080/api';

interface SuccessfulResponse<T> {
    data: T
}

export const abortController = new AbortController();

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000000,
    signal: abortController.signal
});

API.interceptors.request.use((requestConfig) => {
    // console.log('auth provider ', authProvider);
    if (authProvider.isAuthenticated && authProvider.authData?.token) {
        requestConfig.headers.Authorization = `Bearer ${authProvider.authData.token}`;
    }
    return requestConfig;
});

API.interceptors.response.use(value => value, error => {
    console.log('axios error', error);
})

export const validateStorageToken = (token: string) => {
    return API.get<SuccessfulResponse<{ isValid: boolean, user: IUser }>>(baseUrl + '/validate-token', {
        headers: new AxiosHeaders().set('Authorization', `Bearer ${token}`)
    });
}

export const validateUserEmail = (email: string) => {
    return API.post<SuccessfulResponse<{ isEmailExist: boolean }>>(baseUrl + '/validate-email', {
        email
    });
}

export const signIn = (data: { email: string, password: string }) => {
    return API.post<SuccessfulResponse<IAuthData>>('/login', data);
}

//
export const signUp = (data: IUser) => {
    return API.post<SuccessfulResponse<{ user: IUser, token: string, expiresAt: string }>>('/registration', data);
}

export const signOut = () => {
    return API.post('/logout');
}

interface Paginate<T> {
    total: number,
    data: T,
    current_page: number,
    per_page: number
}

export const fetchPosts = (searchString?: string | null) => {
    let queryString = '';
    if (searchString) {
        queryString += '?searchQuery=' + searchString;
    }
    return API.get<Paginate<IPost[]>>('/post' + queryString);
}

export const fetchPost = (id: string) => {
    return API.get<IPost>('/post/' + id);
}

export const addPost = (data: IPost) => {
    return API.post<IPost>('/post', data);
}

export const updatePost = (id: string, data: IPost) => {
    return API.put<IPost>('/post/' + id, data);
}

export const deletePost = (id: string) => {
    return API.delete('/post/' + id);
}


export default API;