import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import login_verified from './login_verified'
// import { ExportToCsv } from 'export-to-csv';
class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    emailhandler = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    
    passwordhandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }



    handleSubmit = event => {
        event.preventDefault();

        const user = {
          password: this.state.password,
          email: this.state.email
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true
        };
    
        axios.post(`http://localhost:5000/login`, user, headers)
          .then(res => {
            console.log(res.data);
            if (res.data.result === true) {
                alert("Please check your email for authentication token","yolo")

                this.props.history.push(
                '/Login_verified'
                // search:   res.data.token ,
                // state: { detail: res.data.token }
                );

            } else {
                alert("Login unsuccessful:( \n"+res.data.info);
            }
        })
        .catch(function (error,res) {
            alert("Login unsuccessful:( \n");
        })
        
        
        
    }
    


    render() {
        return (
            <div>

                <Route path="/Register" exact component={Register}/>        
                <form onSubmit={this.handleSubmit}>
                    <h1>LOGIN</h1>
                    <label>Email :</label> <input id="email" type="text" value={this.state.email} onChange={this.emailhandler} placeholder="Email..." /><br />
                    <label>Password :</label> <input id="password" type="password" value={this.state.password} onChange={this.passwordhandler} placeholder="Password..." /><br />
                    <input id="submit" type="submit" value="Log In" />
                    <li>
                         <label>new tenant?  </label>
                        <Link to="/Register">Register</Link>

                     </li>
                     {/* <li>
                         <label>admin home link   </label>
                        <Link to="/Adminhome">admin</Link>
                     </li> */}
                </form>

            </div>
            
        )
    }

}
export default withRouter(Login)
