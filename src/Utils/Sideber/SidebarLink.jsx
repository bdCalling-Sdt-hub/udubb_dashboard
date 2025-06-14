import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';
import { GrMoney, GrProjects } from 'react-icons/gr';
import { PiBuildingOfficeFill } from 'react-icons/pi';

export const SidebarLink = [
  {
    path: '/',
    label: 'Customers Manage',
    icon: <FaUsersGear size={24} />,
  },
  {
    path: '/employees-manage',
    label: 'Employees',
    icon: <FaUserTie size={24} />,
  },
  // {
  //   path: '/finance-management',
  //   label: 'Finance Manage',
  //   icon: <GrMoney size={24} />,
  // },
  // {
  //   path: '/Office-manage',
  //   label: 'Office Manager',
  //   icon: <PiBuildingOfficeFill size={24} />,
  // },
  {
    path: '/project-manage',
    label: 'Projects Manage',
    icon: <GrProjects size={20} />,
  },
];

export const SettingLinks = [
  {
    path: '/terms-&-condition',
    label: 'Terms & Condition',
  },

  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
  },
  {
    path: '/profile',
    label: 'Profile',
  },
];
