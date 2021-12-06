import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal-ask',
    templateUrl: './modal-ask.component.html'
})
export class ModalAskComponent {
    @Input() content;
    @Input() title;

    constructor(public activeModal: NgbActiveModal) {
    }
}
