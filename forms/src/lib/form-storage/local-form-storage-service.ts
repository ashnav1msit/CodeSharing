import { Injectable } from "@angular/core";
import { FormStorageService } from "./form-storage.service";

@Injectable({
    providedIn: "any",
})
export class LocalFormStorageService extends FormStorageService {

    save<T>(key: string, data: T): Promise<string> {
        if (key) {
            if (data !== undefined && data !== null) {
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                localStorage.removeItem(key);
            }
        } else {
            console.warn("Form has no storageKey defined");
        }
        return Promise.resolve(key);
    }

    get<T>(key: string): Promise<T | undefined> {
        const data = localStorage.getItem(key);
        if (data) {
            return Promise.resolve(JSON.parse(data) as T);
        } else {
            return Promise.resolve(undefined);
        }
    }

}