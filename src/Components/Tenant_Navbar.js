import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
//import { Link } from 'react-router-dom';
import { tenant_SidebarData } from './tenant_SidebarData';
import './Navbar.css';
import axios from 'axios';

import logo from './logo/singhealth.jpg';
import { IconContext } from 'react-icons';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
function TenantNavbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
        <img src={logo} style={{float: "right", } } margin= "10px "width="70" height="70"  alt="Logo"  />

          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {tenant_SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName} id={item.id}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default TenantNavbar;
