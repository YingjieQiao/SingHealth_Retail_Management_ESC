import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Components/Register'
import Login from './Components/Login'
import Home from './Components/home'
import {Route, BrowserRouter as Router,Switch,Link} from "react-router-dom";

function App() {
  return (
    <Router>
    <div className="App">

    <Switch>
    <Route path="/Login" exact component={Login}/>
    <Route path="/Register" exact component={Register}/>
    <Route path="/home" exact component={Home}/>
    </Switch>

    </div>

    </Router>
  );
}

export default App;
