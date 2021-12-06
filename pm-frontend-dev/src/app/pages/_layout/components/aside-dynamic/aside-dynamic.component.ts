import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {DynamicAsideMenuService, LayoutService} from '../../../../_metronic/core';
import {getAuthorities} from '../../../../modules/auth/_services/auth.service';

@Component({
    selector: 'app-aside-dynamic',
    templateUrl: './aside-dynamic.component.html',
    styleUrls: ['./aside-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {
    menuConfig: any;
    subscriptions: Subscription[] = [];

    disableAsideSelfDisplay: boolean;
    headerLogo: string;
    brandSkin: string;
    ulCSSClasses: string;
    asideMenuHTMLAttributes: any = {};
    asideMenuCSSClasses: string;
    asideMenuDropdown;
    brandClasses: string;
    asideMenuScroll = 1;
    asideSelfMinimizeToggle = false;

    currentUrl: string;

    constructor(
        private layout: LayoutService,
        private router: Router,
        private menu: DynamicAsideMenuService,
        private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // load view settings
        this.disableAsideSelfDisplay =
            this.layout.getProp('aside.self.display') === false;
        this.brandSkin = this.layout.getProp('brand.self.theme');
        this.headerLogo = this.getLogo();
        this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
        this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
        this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
        this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
        this.brandClasses = this.layout.getProp('brand');
        this.asideSelfMinimizeToggle = this.layout.getProp(
            'aside.self.minimize.toggle'
        );
        this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
        this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;

        // router subscription
        this.currentUrl = this.router.url.split(/[?#]/)[0];
        const routerSubscr = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.currentUrl = event.url;
            this.cdr.detectChanges();
        });
        this.subscriptions.push(routerSubscr);

        // menu load
        const menuSubscr = this.menu.menuConfig$.subscribe(res => {
            this.buildMenu(res);
        });
        this.subscriptions.push(menuSubscr);
    }

    buildMenu(data: any) {
        const roleUser = getAuthorities();
        const menus = [];
        data.items.forEach(t => {
            if (!t.roles || t.roles.length <= 0 || t.roles.includes(roleUser)) {
                menus.push(t);
            }
        });
        this.menuConfig = {items: menus};
        this.cdr.detectChanges();
    }

    private getLogo() {
        if (this.brandSkin === 'light') {
            return './assets/media/logos/logo.png';
        } else {
            return './assets/media/logos/logo.png';
        }
    }

    isMenuItemActive(path) {
        if (!this.currentUrl || !path) {
            return false;
        }
        if (this.currentUrl === path) {
            return true;
        }
        return this.currentUrl.indexOf(path) > -1;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
