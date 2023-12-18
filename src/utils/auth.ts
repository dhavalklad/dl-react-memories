import {localStorageProvider} from "./local-storage";
import {IAuthData} from "../models/auth";
import {signIn, validateStorageToken} from "./api";
import {LoaderFunction, redirect} from "react-router-dom";
import moment from "moment/moment";

interface AuthProvider {
    isAuthenticated: boolean;
    authData: IAuthData | null;

    signIn(username: string, password: string): Promise<void>;

    signOut(): Promise<void>;

    setAuthData(data: IAuthData): void;
}


const authProvider: AuthProvider = {
    isAuthenticated: false,
    authData: null,

    async signIn(username: string, password: string): Promise<void> {
        const {data, status} = await signIn({
            email: username,
            password: password
        });

        if (status === 200) {
            this.setAuthData(data.data)
            console.log('sign in completed');
        }

        // return Promise.resolve(undefined);
    },
    async signOut(): Promise<void> {
        localStorageProvider.removeUser();
        // signOut();
        this.isAuthenticated = false;
        this.authData = null;
        // return Promise.resolve(undefined);
    },
    setAuthData(data: IAuthData) {
        this.isAuthenticated = true;
        this.authData = data;
        console.log('time remaining', moment().to(moment(data.expiresAt)))
        localStorageProvider.setUser(data);
    }
}

export const mainRootLoader = () => {
    console.log('root loader called');
    return {user: authProvider.authData};
}

export const guestCheckLoader = () => {
    console.log('guestCheckLoader');
    if (authProvider.isAuthenticated) {
        return redirect('/');
    }
    return null;
}

export const authCheckLoader: LoaderFunction = ({request}) => {
    console.log('authCheckLoader');
    if (!authProvider.isAuthenticated) {
        let params = new URLSearchParams();
        params.set("from", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
    }
    return null;
}

export const initializeApp = async () => {
    console.log('inside init');
    // return new Promise((resolve, reject) => {
    //check if storage data available
    if (!localStorageProvider.isUserAvailable()) {
        authProvider.isAuthenticated = false;
        authProvider.authData = null;
        // resolve('');
        return;
    }
    // check if storage token expiry
    const user: IAuthData = localStorageProvider.getUser();
    if (isTokenExpired(user.expiresAt)) {
        localStorageProvider.removeUser();
        authProvider.isAuthenticated = false;
        authProvider.authData = null;
        // resolve('');
        return;
    }
    try {
        const {data} = await validateStorageToken(user.token);
        if (data.data.isValid) {
            authProvider.setAuthData(user);
        }
        console.log('after response auth provider', authProvider);
    } catch (e) {
        console.error('token validation error', e);
        authProvider.isAuthenticated = false;
        authProvider.authData = null;
        localStorageProvider.removeUser();
    }


    // });
}

const isTokenExpired = (expiryDate: string): boolean => {
    return new Date().getTime() > new Date(expiryDate).getTime();
}


export default authProvider;