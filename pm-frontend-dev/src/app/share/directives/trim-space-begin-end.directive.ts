import {Directive, HostListener, Input, Optional} from "@angular/core";
import {FormControlDirective, FormControlName} from "@angular/forms";

@Directive({
    selector: '[trimSpaceBeginEnd]',
})
export class TrimSpaceBeginEndDirective {
    @Input() type: string;

    constructor(@Optional() private formControlDir: FormControlDirective,
                @Optional() private formControlName: FormControlName) {}

    @HostListener('blur')
    @HostListener('keydown.enter')
    trimValue() {
        const control = this.formControlName.control;
        if (typeof control.value === 'string' && control.value != '') {
            control.setValue(control.value.trim());
        }
    }
}
