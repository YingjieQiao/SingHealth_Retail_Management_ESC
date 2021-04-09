import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
const currentURL = window.location.href 
function My404Component() {
    return (
    <div>
        <h1>EROR 404 : Page not found</h1>  
        <h1>{currentURL}</h1>   
    </div>
    )
  }




export default withRouter(My404Component)