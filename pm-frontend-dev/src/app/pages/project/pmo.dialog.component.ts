import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {TargetGroup} from '../../share/models/target-group';
import {UserModel} from '../../modules/auth/_models/user.model';

@Component({
    selector: 'pmo-dialog',
    templateUrl: './pmo.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PmoDialogComponent implements OnInit {

    users = new BehaviorSubject<UserModel[]>([]);
    originValue: UserModel[] = [];

    constructor(
        public dialogRef: MatDialogRef<PmoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.data.users.forEach(tg => {
            const tmp = new UserModel();
            Object.assign(tmp, tg);
            this.originValue.push(tmp);
        });
        this.users.next(this.data.users);
    }

    dialogClose(cancel: boolean): void {
        this.dialogRef.close(cancel ? this.originValue : this.users.value);
    }

    selectPmo(id: number, $event) {
        this.users.value.forEach(tg => {
            if (tg.id === id) {
                tg.selected = $event.target.checked;
            }
        });
        console.log(this.originValue[0].selected);

    }

    selectAll($event) {
        this.users.value.forEach(tg => tg.selected = $event.target.checked);
    }
}
