import React, { Component } from 'react'
import './CSS/todo.css'

import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from 'axios';
import Navbar from './Navbar';

class SignOut extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidMount() {

        axios.get('http://localhost:5000/signout',{withCredentials: true})
        .then(res => {
          console.log(res.data);
          if (res.data.result === true) {
              alert("signout successfull")
              this.props.history.push('/');
          } else {
            alert("crashed while signing out! :(")
              alert(res.data.info);
          }
      })
        // axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
        // .then(
        //     res => {
        //         console.log(res.data);
        //         if(res.data.username==""){
        //           alert("Please Log in!");
        //           this.props.history.push('/');
        //         }
        //     }
        // )
    }

    render() {
        return (
            <div>
                <label>sign out</label>

            </div>
            
        )
    }

}
export default withRouter(SignOut)