import React from 'react';
import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import { NavItemConfig } from '@/models';

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig: NavItemConfig[] = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon(pieChart2Fill)
    },
    {
        title: 'Manage Doctors',
        path: '/dashboard/Doctor',
        icon: getIcon("fa6-solid:user-doctor")
    },
    {
        title: 'Manage Patients',
        path: '/dashboard/Patient',
        icon: getIcon("mdi:patient")
    },
    {
        title: 'Manage Appointments',
        path: '/dashboard/Appointment',
        icon: getIcon("streamline:waiting-appointments-calendar-solid")
    },
    {
        title: 'Manage Specialization',
        path: '/dashboard/Specialization',
        icon: getIcon(shoppingBagFill)
    }
];

export default sidebarConfig;
