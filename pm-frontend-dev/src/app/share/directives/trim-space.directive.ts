import {Directive, HostListener, Input, Optional} from "@angular/core";
import {FormControlDirective, FormControlName} from "@angular/forms";

@Directive({
	selector: '[trimSpace]',
})
export class TrimFormFieldsDirective {
	@Input() type: string;

	constructor(@Optional() private formControlDir: FormControlDirective,
				@Optional() private formControlName: FormControlName) {}

	@HostListener('blur')
	@HostListener('keydown.enter')
	trimValue() {
		const control = this.formControlName.control;
		if (typeof control.value === 'string') {
			control.setValue(control.value.replace(/ /g, ''));
		}
	}
}
