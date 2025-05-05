import { LucideIcon, LayoutDashboard, Calendar, Users, Pill, Stethoscope, UserCog2Icon } from 'lucide-react';

export interface SubMenuItem {
    path: string;
    label: string;
    permission?: string;
}

export interface SidebarItem {
    path: string;
    label: string;
    icon: LucideIcon;
    permission?: string;
    submenu?: SubMenuItem[];
}

const sideBarItems: SidebarItem[] = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        path: '/doctors',
        label: 'Doctors',
        icon: Stethoscope,
        permission: 'doctors.view',
        submenu: [
            { path: '/doctors', label: 'All Doctors', permission: 'doctors.view' },
            { path: '/doctor/new', label: 'Create', permission: 'doctors.create' },
        ]
    },
    {
        path: '/patients',
        label: 'Patients',
        icon: Users,
        permission: 'patients.view',
        submenu: [
            { path: '/patients', label: 'All Patients', permission: 'patients.view' },
            { path: '/patient/new', label: 'Create', permission: 'patients.create' }
        ]
    },
    {
        path: '/appointments',
        label: 'Appointments',
        icon: Calendar,
        permission: 'appointments.view',
        submenu: [
            { path: '/appointments', label: 'All Appointments', permission: 'appointments.view' },
            { path: '/appointments/assigned-to-me', label: 'My Appointments', permission: 'appointments.me' },
            { path: '/appointment/new', label: 'Create', permission: 'appointments.create' }
        ]
    },
    {
        path: '/medicines',
        label: 'Medicines',
        icon: Pill,
        permission: 'medicines.view',
        submenu: [
            { path: '/medicines', label: 'All Medicines', permission: 'medicines.view' },
            { path: '/medicine/new', label: 'Create', permission: 'medicines.create' }
        ]
    },
    {
        path: '/users',
        label: 'Users',
        icon: UserCog2Icon,
        permission: 'users.view',
        submenu: [
            { path: '/users', label: 'All Users', permission: 'users.view' },
            { path: '/user/new', label: 'Create', permission: 'users.create' }
        ]
    },
    {
        path: '/diagnosis',
        label: 'Diagnosis',
        icon: Stethoscope,
        permission: 'diagnosis.view',
        submenu: [
            { path: '/diagnosis', label: 'All Diagnosis', permission: 'diagnosis.view' },
            { path: '/diagnosis/new', label: 'Create', permission: 'diagnosis.create' }
        ]
    }
];

export default sideBarItems;