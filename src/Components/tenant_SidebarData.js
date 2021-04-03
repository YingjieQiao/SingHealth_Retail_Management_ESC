import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';

export const tenant_SidebarData = [

  {
    title: 'tenant Home',
    path: '/tenantHome',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text',
    id:"tenant"
  },

  {
    title: 'tenant Upload',
    path: '/upload',
    icon: <FaIcons.FaUpload />,
    cName: 'nav-text',
    id:"tenant"
  },

  {
    title: 'tenant View',
    path: '/viewPhoto',
    icon: <FaIcons.FaImages />,
    cName: 'nav-text',
    id:"tenant"
  },
  {
    title: 'inbox',
    path: '/email',
    icon: <FaIcons.FaInbox />,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/home',
    icon: <BsIcons.BsPerson />,
    cName: 'nav-text'
  },
  {
    title: 'Get Statistics',
    path: '/dataDashboard',
    icon: <BsIcons.BsGraphUp />,
    cName: 'nav-text'
  },
  {
    title: 'Compare Tenant',
    path: '/compareTenant',
    icon: <MdIcons.MdCompareArrows />,
    cName: 'nav-text'
  },
  {
    title: 'New Audit',
    path: '/audit',
    icon: <AiIcons.AiOutlineAudit />,
    cName: 'nav-text'
  },
  {
    title: 'Sign Out',
    path: '/',
    icon: <FaIcons.FaSignOutAlt />,
    cName: 'nav-text'
  }
];