import { LucideIcon, LayoutDashboard, Calendar, Users, Pill } from 'lucide-react';

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
        path: '/patients',
        label: 'Patients',
        icon: Users,
        permission: 'patients.view',
        submenu: [
            { path: '/patients/list', label: 'All Patients', permission: 'patients.view' },
            { path: '/patients/new', label: 'Create', permission: 'patients.create' }
        ]
    },
    {
        path: '/appointments',
        label: 'Appointments',
        icon: Calendar,
        permission: 'appointments.view',
        submenu: [
            { path: '/appointments/list', label: 'All Appointments', permission: 'appointments.view' },
            { path: '/appointments/create', label: 'Create', permission: 'appointments.create' }
        ]
    },
    {
        path: '/medicines',
        label: 'Medicines',
        icon: Pill,
        permission: 'medicine.view',
        submenu: [
            { path: '/medicines/list', label: 'All Medicines', permission: 'medicine.view' },
            { path: '/medicines/create', label: 'Create', permission: 'medicine.create' }
        ]
    }
];

export default sideBarItems;