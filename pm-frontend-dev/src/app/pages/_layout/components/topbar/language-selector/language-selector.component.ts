import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {TranslationService} from '../../../../../modules/i18n/translation.service';
import {TranslateService} from "@ngx-translate/core";

declare var $: any;

interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
}

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
    language: LanguageFlag;
    languages: LanguageFlag[] = [
        {
            lang: 'en',
            name: 'English',
            flag: './assets/media/svg/flags/260-united-kingdom.svg',
        },
        {
            lang: 'vn',
            name: 'Vietnamese',
            flag: './assets/media/svg/flags/220-vietnam.svg',
        }
    ];

    constructor(
        private translationService: TranslationService,
        public translate: TranslateService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.setSelectedLanguage();
        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe((event) => {
                this.setSelectedLanguage();
            });
    }

    setLanguageWithRefresh(lang) {
        this.setLanguage(lang);
    }

    setLanguage(lang) {
        this.languages.forEach((language: LanguageFlag) => {
            if (language.lang === lang) {
                language.active = true;
                this.language = language;
            } else {
                language.active = false;
            }
        });
        this.translationService.setLanguage(lang);
    }

    setSelectedLanguage(): any {
        this.setLanguage(this.translationService.getSelectedLanguage());
    }
}
