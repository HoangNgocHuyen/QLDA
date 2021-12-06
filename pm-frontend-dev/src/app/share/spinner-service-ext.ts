import {NgxSpinnerService} from 'ngx-spinner';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SpinnerServiceExt {

    private key = '';

    constructor(private spinner: NgxSpinnerService) {

    }

    show(key?: string) {
        this.key = key;
        this.spinner.show();
    }

    hide(key?: string) {
        if (this.key) {
            if (this.key === key) {
                this.key = '';
                this.spinner.hide();
            }
        } else {
            this.spinner.hide();
        }
    }
}
