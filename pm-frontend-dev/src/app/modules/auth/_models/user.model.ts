import {AuthModel} from './auth.model';

export class UserModel extends AuthModel {
    id: number;
    login: string;
    fullName: string;
    email: string;
    imageUrl: string;
    activated: boolean;
    langKey: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    authorities: string[];
    mobile?: string;
    position?: string;
    unitCode?: string;
    selected?: boolean;

    setUser(user: any) {
        this.id = user.id || '';
        this.login = user.login || '';
        this.fullName = user.fullName || '';
        this.email = user.email || '';
        this.imageUrl = user.imageUrl || '';
        this.activated = user.activated || false;
        this.langKey = user.langKey || 'vn';
        this.createdBy = user.createdBy || '';
        this.createdDate = user.createdDate || '';
        this.lastModifiedBy = user.lastModifiedBy || '';
        this.lastModifiedDate = user.lastModifiedDate || '';
        this.authorities = user.authorities || [];
        this.mobile = user.mobile || '';
        this.position = user.position || '';
        this.unitCode = user.unitCode || '';
        this.selected = false;
    }
}
