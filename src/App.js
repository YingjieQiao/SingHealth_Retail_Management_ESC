import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
//import Registeration_Confirmation from './Components/Registeration_Confirmation';
import Login from './Components/Login';
import Login_verified from './Components/login_verified';
import Home from './Components/home';
import Upload from './Components/upload';
import email from './Components/email';
import viewPhoto from './Components/viewPhoto';
import dataDashboard from './Components/dataDashboard';
import dataDashboardTenant from './Components/dataDashboardTenant';
import dataDashboardCompareTenant from './Components/dataDashboardCompareTenant';
import compareTenant from './Components/compareTenant';
import audit from './Components/audit';
import {Route, BrowserRouter as Router,Switch,Link} from "react-router-dom";
import Navbar from './Components/Navbar';
import Adminhome from './Components/adminhome';
import Table from './Components/Table';
import tenantHome from './Components/tenantHome';
import emailReport from './Components/emailReport';
function App() {

  return (
    <Router>
    <div className="App">

    <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/Register" exact component={Register}/>
      <Route path="/Login_verified" exact component={Login_verified}/>
      <Route path="/home" exact component={Home}/>
      <Route path="/upload" exact component={Upload}/>
      <Route path="/email" exact component={email}/>
      <Route path="/viewPhoto" exact component={viewPhoto}/>
      <Route path="/dataDashboard" exact component={dataDashboard}/>
      <Route path="/dataDashboardTenant" exact component={dataDashboardTenant}/>
      <Route path="/dataDashboardCompareTenant" exact component={dataDashboardCompareTenant}/>
      <Route path="/compareTenant" exact component={compareTenant}/>
      <Route path="/audit" exact component={audit}/>
      <Route path="/adminhome" exact component={Adminhome}/>
      <Route path="/table" exact component={Table}/>
      <Route path="/tenantHome" exact component={tenantHome}/>
      <Route path="/emailReport" exact component={emailReport}/>
    </Switch>
    
    </div>

    </Router>
  );
}

export default App;