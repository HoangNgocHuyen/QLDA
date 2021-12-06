import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Target} from '../../share/models/target';

@Component({
    selector: 'target-detail',
    templateUrl: './target-detail.component.html',
})
export class TargetDetailComponent implements OnInit {
    target: Target | null = null;

    constructor(protected activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({target}) => {
            this.target = target;
        });
    }

    previousState(): void {
        window.history.back();
    }

}
