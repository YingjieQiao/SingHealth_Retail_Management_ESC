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
            'Access-Control-Allow-Origin': '*'
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
        // .catch(function (error,res) {
        //     console.log(error.response.status) // 401
        //     console.log(error.response.data.error) //Please Authenticate or whatever returned from server
        //   if(error.response.status==401){
        //     alert("Login unsuccess!")
        //     alert(res.data.info);
        //   }
        // })
        
        
        
    }
    


    render() {
        return (
            <div>
                 <nav>
                        <p>yolo</p>
                   </nav>
                <Route path="/Register" exact component={Register}/>        
                <form onSubmit={this.handleSubmit}>
                    <h1>LOGIN</h1>
                    <label>Email :</label> <input type="text" value={this.state.email} onChange={this.emailhandler} placeholder="Email..." /><br />
                    <label>Password :</label> <input type="password" value={this.state.password} onChange={this.passwordhandler} placeholder="Password..." /><br />
                    <input type="submit" value="Log In" />
                    <li>
                         <label>new tenant?  </label>
                        <Link to="/Register">Register</Link>

                     </li>
                     <li>
                         <label>admin home link   </label>
                        <Link to="/Adminhome">admin</Link>

                     </li>
                </form>

            </div>
            
        )
    }

}
export default withRouter(Login)
