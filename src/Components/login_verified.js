import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import { useLocation } from "react-router-dom";

class login_verified extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
    console.log(this.props.location.state.detail);
    axios.get(`http://localhost:5000//login_verified/`+this.props.location.state.detail)
          .then(res => {

            console.log(res.data);
            console.log('Click happened');
            if (res.data.result === true) {
                alert("Login success!\n "+res.data.result+"\n"+res.data.info);
                this.props.history.push('/home');
              
            } 
            else {
                if(res.data.info=="Link has expired"){
                alert("Login unsuccessful:( \n"+res.data.info);
                this.props.history.push('/');
                } 

              }
        })

  }
  render() {
    return (
    <div>
      <h1>Login Verification</h1>
      <button onClick={this.handleClick}>Click Me</button>;
    </div>
    )
  }
}



export default withRouter(login_verified)
