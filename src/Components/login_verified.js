import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import logo from './logo/singhealth.jpg';
import background from './logo/background.jpg';
class login_verified extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Enter_Token : ""
    }
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  tokenhandler = (event) => {
    this.setState({
        Enter_Token: event.target.value
    })
  }
  // handleClick() {
  //   console.log('Click happened');
  //   console.log(this.props.location.state.detail);
  //   axios.get(`http://localhost:5000//login_verified/`+this.props.location.state.detail)
  //         .then(res => {

  //           console.log(res.data);
  //           console.log('Click happened');
  //           if (res.data.result === true) {
  //               alert("Login success!\n "+res.data.result+"\n"+res.data.info);
  //               this.props.history.push('/home');
              
  //           } 
  //           else {
  //               if(res.data.info=="Link has expired"){
  //               alert("Login unsuccessful:( \n"+res.data.info);
  //               this.props.history.push('/');
  //               } 

  //             }
  //       })

  //}
  handleSubmit = event => {
    event.preventDefault();

    const user = {
      token: this.state.Enter_Token,

    };
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        withCredentials: true
        
    };
    console.log("dat");
    //Todo: dedlete thiss after testing
    if(this.state.Enter_Token=="tenant"){
      alert("Login success!");
      this.props.history.push('/tenantHome');
    }
    else if(this.state.Enter_Token=="staff"){
      alert("Login success!");
      this.props.history.push('/home');
    }
    else if(this.state.Enter_Token=="admin"){
      alert("Login success!");
      this.props.history.push('/Adminhome');
    }
    else{
    axios.post(`http://localhost:5000/login_verified`, user, headers)
      .then(res => {
        console.log(res.data);
        if (res.data.result === true) {
            alert("Login success!")
            if(res.data.tenant){
              localStorage.setItem("usertype","tenant");
            this.props.history.push('/tenantHome');
            }
            else if(res.data.staff){
              localStorage.setItem("usertype","staff")  ;
              this.props.history.push('/home');
              }
              else if(res.data.admin){
                this.props.history.push('/Adminhome');
              }
        } else {
            alert("Login unsuccessful:( \n"+res.data.info);
            this.props.history.push('/');
        }
    })
  }
  }
  // componentDidMount() {

  //   axios.get("http://localhost:5000/get_current_username_and_datetime")
  //   .then(
  //       res => {
  //           console.log(res.data);
  //           if(res.data.username==""||res.data.username=="UnitTester"){
  //             alert("Please Log in!");
  //             this.props.history.push('/');
  //           }
  //       }
  //   )}
  render() {
    return (
      <div style={{ 
        backgroundImage: `url(${background})`,  backgroundSize: "cover"
                        }}>
    <div class="container22">

        
        <img src={logo}  width="250" height="250" margin="3000px" margin-bottom="-30" alt="Logo"  />
    <div class="container"  >

    <div>
       <form onSubmit={this.handleSubmit}>
        <h1>Login Verification</h1>
        <h2> check your email for token id</h2>
        
        <label>Enter Token :</label> <input id="token" type="text" value={this.state.Enter_Token} onChange={this.tokenhandler} placeholder="Token" /><br />
        <input id="submiting" type="submit" value="Log In" />
        </form>
    </div>
    </div>
    </div>
    </div>
    )
  }
}



export default withRouter(login_verified)