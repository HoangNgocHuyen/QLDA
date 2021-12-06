import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LayoutService} from '../../../../../core';
import {UserModel} from '../../../../../../modules/auth/_models/user.model';
import {AuthService} from '../../../../../../modules/auth/_services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordDialogComponent} from '../../../../../../modules/auth/change-password/change-password.dialog.component';

@Component({
    selector: 'app-user-dropdown-inner',
    templateUrl: './user-dropdown-inner.component.html',
    styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
    extrasUserDropdownStyle: 'light' | 'dark' = 'light';
    user$: Observable<UserModel>;

    constructor(
        private layout: LayoutService,
        private auth: AuthService,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.extrasUserDropdownStyle = this.layout.getProp(
            'extras.user.dropdown.style'
        );
        this.user$ = this.auth.currentUserSubject.asObservable();
    }

    changePassword() {
        this.dialog.open(ChangePasswordDialogComponent, {
            width: '500px'
        });
    }

    logout() {
        this.auth.logout();
        document.location.reload();
    }
}
