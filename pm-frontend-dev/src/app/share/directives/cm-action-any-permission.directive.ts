import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from "../../modules/auth/_services/auth.service";

@Directive({
    selector: '[cmActionAnyPermission]'
})
export class CmActionAnyPermissionDirective {

    private roles: string[];

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private route: ActivatedRoute
    ) {
    }

    @Input()
    set cmActionAnyPermission(roles: string[]) {
        this.roles = roles;
        this.updateViewAny();
        // Tu dong thay doi view khi quyen trong accountService.userIdentity thay doi
        this.authService.getAuthenticationState().subscribe(() => this.updateViewAny());
    }

    private updateViewAny(): void {
        let hasAnyAuthority = false;
        this.roles.forEach(t => {
            if (this.authService.hasAnyAuthority(t)) {
                hasAnyAuthority = true;
                return;
            }
        })
        this.viewContainerRef.clear();
        if (hasAnyAuthority) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
