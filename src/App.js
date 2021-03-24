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
import {Route, BrowserRouter as Router,Switch,Link} from "react-router-dom";
import Navbar from './Components/Navbar';
import Adminhome from './Components/adminhome';

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
      <Route path="/adminhome" exact component={Adminhome}/>

    </Switch>
    
    </div>

    </Router>
  );
}

export default App;