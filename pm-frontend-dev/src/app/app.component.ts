import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslationService} from './modules/i18n/translation.service';
import {SplashScreenService} from './_metronic/partials/layout/splash-screen/splash-screen.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

// language list
import {locale as enLang} from './modules/i18n/vocabs/en';
import {locale as vnLang} from './modules/i18n/vocabs/vn';
import {locale as enUserManagementLang} from './modules/i18n/user-management/en';
import {locale as vnUserManagementLang} from './modules/i18n/user-management/vn';
import {locale as enUnitManagementLang} from './modules/i18n/unit-management/en';
import {locale as vnUnitManagementLang} from './modules/i18n/unit-management/vn';
import {locale as vnTargetLang} from './modules/i18n/target/vn';
import {locale as enTargetLang} from './modules/i18n/target/en';
import {locale as enProjectLang} from './modules/i18n/project/en';
import {locale as vnProjectLang} from './modules/i18n/project/vn';
import {locale as enNotificationLang} from './modules/i18n/notification/en';
import {locale as vnNotificationLang} from './modules/i18n/notification/vn';

@Component({
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private translationService: TranslationService,
        private splashScreenService: SplashScreenService,
        private router: Router
    ) {
        // register translations
        this.translationService.loadTranslations(
            enLang,
            vnLang,
            enUserManagementLang,
            vnUserManagementLang,
            enUnitManagementLang,
            vnUnitManagementLang,
            vnTargetLang,
            enTargetLang,
            enProjectLang,
            vnProjectLang,
            enNotificationLang,
            vnNotificationLang,
        );
    }

    ngOnInit() {
        const routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // hide splash screen
                this.splashScreenService.hide();

                // scroll to top on every route change
                window.scrollTo(0, 0);

                // to display back the body content
                setTimeout(() => {
                    document.body.classList.add('page-loaded');
                }, 500);
            }
        });
        this.unsubscribe.push(routerSubscription);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
