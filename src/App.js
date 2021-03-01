import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/home';
import Upload from './Components/upload';
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
    </Switch>
    
    </div>

    </Router>
  );
}

export default App;
