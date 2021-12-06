import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DynamicAsideMenuConfig} from '../../configs/dynamic-aside-menu.config';

const emptyMenuConfig = {
    items: []
};

@Injectable({
    providedIn: 'root'
})
export class DynamicAsideMenuService {
    private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
    menuConfig$: Observable<any>;

    constructor() {
        this.menuConfig$ = this.menuConfigSubject.asObservable();
        this.loadMenu();
    }

    // Here you able to load your menu from server/data-base/localStorage
    // Default => from DynamicAsideMenuConfig
    private loadMenu() {
        let menu = DynamicAsideMenuConfig;
        /*const userMatrix = getUserMatrix();
        if (!userMatrix || userMatrix.length === 0) {
            menu.items = [];
        } else {
            menu.items = menu.items.filter(t => {
                if (checkUserMatrix(userMatrix, t.page)) {
                    return t;
                }
            });
            if (menu.items === null) {
                menu.items = [];
            }
        }*/
        this.setMenu(menu);
    }

    private setMenu(menuConfig) {
        this.menuConfigSubject.next(menuConfig);
    }

    private getMenu(): any {
        return this.menuConfigSubject.value;
    }
}
