import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
//import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import axios from 'axios';
import { IconContext } from 'react-icons';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [staff, setstaff] = useState(false);
  const [tenant, settenant] = useState(false);

  axios.get(`http://localhost:5000/check_if_tenant`)
          .then(res => {
            console.log(res.data);
            console.log("tenant");
            settenant(res.data.result);
        })
        axios.get(`http://localhost:5000/check_if_staff`)
        .then(res => {
          console.log(res.data);
          console.log("staff");
          setstaff(res.data.result);
      })
  // if(localStorage.getItem("usertype")==="staff"){
  //   var staff=true;
  //   var tenant= false;
  // }
  // else if(localStorage.getItem("usertype")==="tenant"){
  //   var staff=false;
  //   var tenant= true;
  // }
//   else{
//   var staff=false;
//   var tenant= false;
// }
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
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
            {SidebarData.map((item, index) => {
              if(staff && item.id!="tenant"){
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );}
              else if(tenant && item.id!="staff"){
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );}
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
