import {RolesEnums} from '../../share/constants/roles.enums';

export const DynamicAsideMenuConfig = {
    items: [
        {
            title: 'Dashboard',
            root: true,
            icon: 'flaticon2-architecture-and-city',
            svg: './assets/media/svg/icons/Design/Layers.svg',
            page: '/dashboard',
            translate: 'MENU.DASHBOARD',
            bullet: 'dot',
            roles: []
        },
        {
            title: 'User management',
            root: true,
            bullet: 'dot',
            page: '/user-management',
            icon: 'fa-user',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.USER_MANAGEMENT',
            roles: [RolesEnums.ROLE_ADMIN]
        },
        {
            title: 'Project management',
            root: true,
            bullet: 'dot',
            page: '/project',
            icon: 'fa-user',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.PROJECT_MANAGEMENT',
            roles: [RolesEnums.ROLE_LEADER_SPECIAL, RolesEnums.ROLE_EMPLOYEE_SPECIAL, RolesEnums.ROLE_LEADER]
        },
        {
            title: 'Category',
            root: true,
            bullet: 'dot',
            icon: 'fa-user',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.CATEGORY',
            roles: [RolesEnums.ROLE_ADMIN],
            submenu: [
                {
                    title: 'Region management',
                    root: true,
                    page: '/category/region',
                    icon: 'fa-chevron-right',
                    svg: './assets/media/svg/icons/Design/Cap-2.svg',
                    translate: 'MENU.REGION_MANAGEMENT'
                },
                {
                    title: 'Unit management',
                    root: true,
                    page: '/category/unit',
                    icon: 'fa-chevron-right',
                    svg: './assets/media/svg/icons/Design/Cap-2.svg',
                    translate: 'MENU.UNIT_MANAGEMENT'
                },
                {
                    title: 'Target group management',
                    root: true,
                    page: '/category/target-groups',
                    icon: 'fa-chevron-right',
                    svg: './assets/media/svg/icons/Design/Cap-2.svg',
                    translate: 'MENU.TARGET_GROUP_MANAGEMENT'
                }
            ]
        },
        // {
        //     title: 'Target management',
        //     root: true,
        //     bullet: 'dot',
        //     page: '/target',
        //     icon: 'fa-user',
        //     svg: './assets/media/svg/icons/Design/Cap-2.svg',
        //     translate: 'MENU.TARGET_MANAGEMENT'
        // },
        {
            title: 'Task management',
            root: true,
            bullet: 'dot',
            page: '/task',
            icon: 'fa-user',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.TASK_MANAGEMENT',
            roles: [RolesEnums.ROLE_LEADER_SPECIAL, RolesEnums.ROLE_LEADER, RolesEnums.ROLE_EMPLOYEE_SPECIAL, RolesEnums.ROLE_EMPLOYEE],
        },
        {
            title: 'Report',
            root: true,
            bullet: 'dot',
            page: '/report',
            icon: 'fa-calendar',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.REPORT',
            roles: [RolesEnums.ROLE_LEADER_SPECIAL, RolesEnums.ROLE_EMPLOYEE_SPECIAL, RolesEnums.ROLE_LEADER]
        },
        {
            title: 'Notification',
            root: true,
            bullet: 'dot',
            page: '/notification',
            icon: 'fa-calendar',
            svg: './assets/media/svg/icons/Design/Cap-2.svg',
            translate: 'MENU.NOTIFICATION_MANAGEMENT',
            roles: [RolesEnums.ROLE_LEADER_SPECIAL, RolesEnums.ROLE_LEADER]
        }
    ]
};
