import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
  {
    title: 'Home',
    path: '/home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Upload Photos',
    path: '/home',
    icon: <FaIcons.FaUpload />,
    cName: 'nav-text'
  },
  {
    title: 'View Photos',
    path: '/home',
    icon: <FaIcons.FaImages />,
    cName: 'nav-text'
  },
  {
    title: 'inbox',
    path: '/home',
    icon: <FaIcons.FaInbox />,
    cName: 'nav-text'
  },
  {
    title: 'Messages',
    path: '/home',
    icon: <BsIcons.BsPerson />,
    cName: 'nav-text'
  },
  {
    title: 'Sign Out',
    path: '/',
    icon: <FaIcons.FaSignOutAlt />,
    cName: 'nav-text'
  }
];