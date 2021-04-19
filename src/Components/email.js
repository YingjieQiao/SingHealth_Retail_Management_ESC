import React, { Component } from 'react'
import './CSS/todo.css'

import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import Navbar from './Navbar';

class Email extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            subject: "",
            content:"",
        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    emailhandler = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    
    subjecthandler = (event) => {
        this.setState({
            subject: event.target.value
        })
    } 
   contenthandler = (event) => {
        this.setState({
            content: event.target.value
        })
    }


    handleSubmit = event => {
        event.preventDefault();
    
        const user = {
          subject: this.state.subject,
          email: this.state.email,
          content: this.state.content
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true
        };
    
        axios.post('http://localhost:5000/email', user, headers)
          .then(res => {
            console.log(res.data);
            if (res.data.result === true) {
                alert("Email sent success!")
                this.props.history.push('/home');
            } else {
                alert(res.data.info);
            }
        })
        
        
        
    }
    
    componentDidMount() {

        axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
        .then(
            res => {
                console.log(res.data);
                if(res.data.username==""){
                  alert("Please Log in!");
                  this.props.history.push('/');
                }
            }
        )}

    render() {
        return (
            <div>
            <Navbar/>

     
                <form onSubmit={this.handleSubmit}>
                    <h1>Send email</h1>
                    <label>Email :</label> <input  type="text" id="emailid" value={this.state.email} onChange={this.emailhandler} placeholder="Email..." /><br />
                    <label>Subject :</label> <input type="text" id="subject" value={this.state.subject} onChange={this.subjecthandler} placeholder="subject..." /><br />
                    <label>Content :</label> <input type="text" id="content" value={this.state.content} onChange={this.contenthandler} placeholder="content..." /><br />            
                    <input type="submit" id="submit" value="Send" />

                </form>

            </div>
            
        )
    }

}
export default withRouter(Email)