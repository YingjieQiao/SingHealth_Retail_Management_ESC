import React, { Component } from 'react'
import './CSS/todo.css'
import Register from './Register'
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';


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

//yolo

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
                alert("Login success!")
                this.props.history.push('/home');
            } else {
                alert(res.data.info);
            }
        })
        
        
        
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
                         <label>new tenent?  </label>
                        <Link to="/Register">Register</Link>

                     </li>
                </form>

            </div>
            
        )
    }

}
export default withRouter(Login)
