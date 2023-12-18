import {IAuthData} from "../models/auth";

interface StorageProvider {
    isStorageItemAvailable(key: string): boolean;

    setUser(user: IAuthData): void;

    getUser(): IAuthData;

    isUserAvailable(): boolean;

    removeUser(): void;
}

export const localStorageProvider: StorageProvider = {
    getUser(): IAuthData {
        return JSON.parse(localStorage.getItem('user') as string);
    }, isStorageItemAvailable(key: string): boolean {
        let storageData = localStorage.getItem(key);
        return !!storageData;
    }, isUserAvailable(): boolean {
        return this.isStorageItemAvailable('user');
    }, removeUser(): void {
        localStorage.removeItem('user');
    }, setUser(user: IAuthData): void {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

