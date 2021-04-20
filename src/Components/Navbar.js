import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
//import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import axios from 'axios';
import logo from './logo/singhealth.jpg';
import { IconContext } from 'react-icons';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";

function login_handler(){
  axios.post('http://localhost:5000/signout')
  .then(res => {
    console.log(res.data);
    if (res.data.result === true) {
        alert("signout successfull")
        this.props.history.push('/');
    } else {
        alert(res.data.info);
    }
})
}

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
      <img src={logo} style={{float: "right", } } margin= "10px "width="80" height="80"  alt="Logo"  />

        <div className='navbar'>
          <Link to='#' className='menu-bars'>
          
            <FaIcons.FaBars onClick={showSidebar} />
          

          </Link>
        </div>
        <nav id="yolo" className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items'  onClick={showSidebar}>
            <li className='navbar-toggle' >
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName} id={item.id} {...(item.id)==="signout"?onclick=login_handler():{}}>
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

export default Navbar;
