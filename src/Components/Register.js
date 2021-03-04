import React, { Component } from 'react'
import './CSS/todo.css'
import {Route, BrowserRouter as Router,Switch,Link,withRouter} from "react-router-dom";
import Login from './Login';
import axios from 'axios';


class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: "",
            lastName: "",
            email:"",
            mobile: "",
            password: "",
            REpassword: "",
            location: "",


        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    firsthandler = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }
    lasthandler = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }
    emailhandler = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    mobilehandler = (event) => {
        this.setState({
            mobile: event.target.value
        })
    }
    passwordhandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    REpasswordhandler = (event) => {
        this.setState({
            REpassword: event.target.value
        })
    }

    locationhandler = (event) => {
        this.setState({
            location: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if( this.state.firstName==""|
            this.state.lastName==""|
            this.state.email==""|
            this.state.mobile==""|
            this.state.password==""|
            this.state.location==""){
                alert(` Registered UnSuccessfully !!!!\n some parameters are empty`)
                this.props.history.push('/Register');
            }
        else if(this.state.password!=this.state.REpassword){
            alert(` pasword did not match!! !!!!`)
            this.props.history.push('/Register');
        }    
        else{
            
                const user = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    mobile: this.state.mobile,
                    password: this.state.password,
                    location: this.state.location
                };
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                };
            
                axios.post(`http://localhost:5000/signup`, user, headers)
                    .then(res => {
                      console.log(res);
                      console.log(res.data);
                })
            
                console.log(this.state);
                this.setState({
                    firstName: "",
                    lastName: "",
                    email:"",
                    mobile: "",
                    password: '',
                    REpassword: '',
                    location: "",
                })

                alert(`${this.state.firstName} ${this.state.lastName}  Registered Successfully !!!!`)
                this.props.history.push('/');
            }
            }
        


    render() {
        return (
            <div>
                <Route path="/" exact component={Login}/>        

                <form onSubmit={this.handleSubmit}>
                    <h1>User Registration</h1>
                    <label>First Name :</label> <input type="text" value={this.state.firstName} onChange={this.firsthandler} placeholder="FirstName..." /><br />
                    <label>Last Name :</label> <input type="text" value={this.state.lastName} onChange={this.lasthandler} placeholder="LastName..." /><br />
                    <label>email id :</label> <input type="text" value={this.state.email} onChange={this.emailhandler} placeholder="email id..." /><br />
                    <label>mobile no :</label> <input type="number" value={this.state.mobile} onChange={this.mobilehandler} placeholder="Mobile number..." /><br />
                    <label>Password :</label> <input type="password" value={this.state.password} onChange={this.passwordhandler} placeholder="Password..." /><br />
                    <label>RE-Password :</label> <input type="password" value={this.state.REpassword} onChange={this.REpasswordhandler} placeholder="RE-Password..." /><br />

                    <label>location :</label><select onChange={this.locationhandler} defaultValue="none">
                        <option defaultValue>Select location</option>
                        <option value="SUTD">SUTD</option>
                        <option value="NUS">NUS</option>
                        <option value="None">None</option>
                    </select><br />

                    <input type="submit" value="Submit"  />

                    <li>
                         <label>Sign in? </label>
                        <Link to="/">Login</Link>

                     </li>
                </form >

            </div>
            
        )
    }
}

export default withRouter(Register)