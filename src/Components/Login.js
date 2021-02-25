import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link} from "react-router-dom";

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
            emmail: event.target.value
        })
    }

    
    passwordhandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }




    handleSubmit = (event) => {
   //     alert(`${this.state.firstName} ${this.state.lastName}  Registered Successfully !!!!`)
        console.log(this.state);
        this.setState({
            email: "",
            password: '',

        })
     event.preventDefault()
        
    }




    render() {
        return (
            <div>
                
                <Route path="/Register" exact component={Register}/>        
                <form onSubmit={this.handleSubmit}>
                    <h1>LOGIN</h1>
                    <label>Email :</label> <input type="text" value={this.state.email} onChange={this.emailhandler} placeholder="Email..." /><br />
                    <label>Password :</label> <input type="password" value={this.state.password} onChange={this.passwordhandler} placeholder="Password..." /><br />
                    <input type="submit" value="Log In" />
                    <li>
                         <label>new tenent?  </label>
                        <Link to="/Register">Register</Link>

                     </li>
                </form>

            </div>
            
        )
    }

}
export default Login
