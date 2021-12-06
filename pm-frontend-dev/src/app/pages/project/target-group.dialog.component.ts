import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import {TargetGroup} from '../../share/models/target-group';

@Component({
    selector: 'target-group-dialog',
    templateUrl: './target-group.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TargetGroupDialogComponent implements OnInit {

    targetGroups = new BehaviorSubject<TargetGroup[]>([]);
    originValue: TargetGroup[] = [];

    constructor(
        public dialogRef: MatDialogRef<TargetGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.data.targetGroups.forEach(tg => {
            let tmp = new TargetGroup();
            Object.assign(tmp, tg);
            this.originValue.push(tmp);
        });
        this.targetGroups.next(this.data.targetGroups);
    }

    dialogClose(cancel: boolean): void {
        this.dialogRef.close(cancel ? this.originValue : this.targetGroups.value);
    }

    selectTargetGroup(code: string, $event) {
        this.targetGroups.value.forEach(tg => {
            if (tg.code === code) {
                tg.selected = $event.target.checked;
            }
        });
        console.log(this.originValue[0].selected);

    }

    selectAll($event) {
        this.targetGroups.value.forEach(tg => tg.selected = $event.target.checked);
    }
}
