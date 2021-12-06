import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from "../../modules/auth/_services/auth.service";

@Directive({
    selector: '[cmActionPermission]'
})
export class CmActionPermissionDirective {

    private role: string;

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private route: ActivatedRoute
    ) {
    }

    @Input()
    set cmActionPermission(role: string) {
        this.role = role;
        this.updateView();
        // Tu dong thay doi view khi quyen trong accountService.userIdentity thay doi
        this.authService.getAuthenticationState().subscribe(() => this.updateView());
    }


    private updateView(): void {
        const hasAnyAuthority = this.authService.hasAnyAuthority(this.role);
        this.viewContainerRef.clear();
        if (hasAnyAuthority) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
