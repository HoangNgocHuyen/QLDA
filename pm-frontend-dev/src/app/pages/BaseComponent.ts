import {getAuthorities, getUserInfo} from '../modules/auth/_services/auth.service';
import {UserModel} from '../modules/auth/_models/user.model';
import {RolesEnums, UNIT_SPECIAL} from '../share/constants/roles.enums';
import {PAGE_OPTIONS} from '../share/constants/input.constants';

export class BaseComponent {

    userAuthorities = getAuthorities();
    userIdentity: UserModel = getUserInfo();
    unitCodeSpecial = UNIT_SPECIAL;
    roleEnums = RolesEnums;

    pageOptions = PAGE_OPTIONS;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalElement: number = 0;
    ascending: boolean = true;
}

export const USER_STATUS = [
    {
        activated: true,
        desc: 'user_management.status.activated'
    },
    {
        activated: false,
        desc: 'user_management.status.not_activated'
    }
];
export const POSITIONS = [
    {
        position: 'LEADER',
        desc: 'user_management.position.LEADER'
    },
    {
        position: 'EMPLOYEE',
        desc: 'user_management.position.EMPLOYEE'
    },
    {
        position: 'ADMIN',
        desc: 'user_management.position.ADMIN'
    }
]
