import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CacheService {

    private CACHE_TIME = 60 * 1000;
    private CACHE_SESSION_TIME = 100 * 60 * 1000;

    public put<T>(key: string, value: T, timeout?: number) {
        let cache = new Cache<T>(value, Date.now() + (timeout ? timeout : this.CACHE_TIME));
        localStorage.setItem(key, JSON.stringify(cache));
    }

    public get<T>(key: string): T {
        let str = localStorage.getItem(key);
        let cache = str ? JSON.parse(str) as Cache<T> : null;
        if (!cache || cache.expire < Date.now()) {
            localStorage.removeItem(key);
            return null;
        }
        return cache.value;
    }

    public putSession<T>(key: string, value: T) {
        let cache = new Cache<T>(value, Date.now() + this.CACHE_SESSION_TIME);
        sessionStorage.setItem(key, JSON.stringify(cache));
    }

    public getSession<T>(key: string): T {
        let str = sessionStorage.getItem(key);
        let cache = str ? JSON.parse(str) as Cache<T> : null;
        if (!cache || cache.expire < Date.now()) {
            sessionStorage.removeItem(key);
            return null;
        }
        return cache.value;
    }

}

export class Cache<T> {
    value: T;
    expire: number;

    constructor(value: T, expire: number) {
        this.value = value;
        this.expire = expire;
    }
}

export const REGION_LIST = 'REGION_LIST';
export const AREA_LIST = 'AREA_LIST';
export const PROVINCE_LIST = 'PROVINCE_LIST';
export const DISTRICT_LIST = 'DISTRICT_LIST';
