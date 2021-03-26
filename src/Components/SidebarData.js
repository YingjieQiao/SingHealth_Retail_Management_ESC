import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
  {
    title: 'Home',
    path: '/home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text',
    id:'home'
  },
  {
    title: 'Upload Photos',
    path: '/upload',
    icon: <FaIcons.FaUpload />,
    cName: 'nav-text',
    id: 'Upload'
  },
  {
    title: 'View Photos',
    path: '/viewPhoto',
    icon: <FaIcons.FaImages />,
    cName: 'nav-text',
    id:'view'
  },
  {
    title: 'inbox',
    path: '/email',
    icon: <FaIcons.FaInbox />,
    cName: 'nav-text',
    id:'inbox'
  },
  {
    title: 'Profile',
    path: '/home',
    icon: <BsIcons.BsPerson />,
    cName: 'nav-text',
    id:'profile'
  },
  {
    title: 'Get Statistics',
    path: '/dataDashboard',
    icon: <BsIcons.BsGraphUp />,
    cName: 'nav-text',
    id:'stats'

  },
  {
    title: 'Compare Tenant',
    path: '/compareTenant',
    icon: <MdIcons.MdCompareArrows />,
    cName: 'nav-text',
    id:'tenent'
  },
  {
    title: 'New Audit',
    path: '/audit',
    icon: <AiIcons.AiOutlineAudit />,
    cName: 'nav-text',
    id:'audit'
  },
  {
    title: 'Sign Out',
    path: '/',
    icon: <FaIcons.FaSignOutAlt />,
    cName: 'nav-text',
    id:'signout'
  }
];