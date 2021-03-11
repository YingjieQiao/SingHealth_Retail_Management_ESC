import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/home';
import Upload from './Components/upload';
import email from './Components/email';
import viewPhoto from './Components/viewPhoto';
import dataDashboard from './Components/dataDashboard';
import dataDashboardTenant from './Components/dataDashboardTenant';
import compareTenant from './Components/compareTenant';
import {Route, BrowserRouter as Router,Switch,Link} from "react-router-dom";
import Navbar from './Components/Navbar';

function App() {

  return (
    <Router>
    <div className="App">

    <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/Register" exact component={Register}/>
      <Route path="/home" exact component={Home}/>
      <Route path="/upload" exact component={Upload}/>
      <Route path="/email" exact component={email}/>
      <Route path="/viewPhoto" exact component={viewPhoto}/>
      <Route path="/dataDashboard" exact component={dataDashboard}/>
      <Route path="/dataDashboardTenant" exact component={dataDashboardTenant}/>
      <Route path="/compareTenant" exact component={compareTenant}/>
    </Switch>
    
    </div>

    </Router>
  );
}

export default App;