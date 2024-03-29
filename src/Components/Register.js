import React, { Component } from 'react'
import './CSS/todo.css'
import {Route, BrowserRouter as Router,Switch,Link,withRouter} from "react-router-dom";
import Login from './Login';
import axios from 'axios';
import logo from './logo/singhealth.jpg';
import background from './logo/background.jpg';
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
            staff:false,
            tenant:false,
            admin:false,
            fnb:false,

        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    fnbhandler = (event) => {
            if (event.target.value=="fnb"){
                this.setState({
                fnb: true
            })}
            else {
                this.setState({
                fnb: false
            })}
    }

    rendervalue(){
        if(this.state.tenant===true){
        return (
          <div>
                    <label>Type of tenant :</label><select onChange={this.fnbhandler} defaultValue="">
                        <option defaultValue>Select tenant type</option>
                        <option value="fnb">fnb</option>
                        <option value="non-fnb">non-fnb</option>

                    </select><br />
          </div>
       )
      }
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
    userhandler = (event) => {
        if (event.target.value=="Tenant"){
            this.setState({
            tenant: true,
            staff: false,
            admin:false 
        })}
        else if (event.target.value=="Staff"){
            this.setState({
            tenant: false,
            staff: true,
            admin:false 
        })}
        else if (event.target.value=="Admin"){
            this.setState({
            tenant: false,
            staff: false,
            admin:true 
        })}
        else{
            this.setState({
            tenant: false,
            staff: false,
            admin:false 
        })}
        
    }
    tenanttypehandler = (event) => {
        
        this.setState({
            tenanttype: event.target.value

        })
        if (event.target.value=="fnb"){
            this.setState({
            fnb: true
        })}
        else {
            this.setState({
            fnb: false
        })}
    }

    rendervalue(){
        if(this.state.tenant===true){
        return (
          <div>
                    <label>tenant type:&nbsp;</label><select onChange={this.tenanttypehandler} defaultValue="">
                        <option defaultValue>Select tenant type</option>
                        <option value="fnb">fnb</option>
                        <option value="non-fnb">non-fnb</option>

                    </select><br />
          </div>
       )
      }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if( this.state.firstName===""|
            this.state.lastName===""|
            this.state.email===""|
            this.state.mobile===""|
            this.state.password===""|
            this.state.location===""|
            this.state.user===""
            ){
                alert(` Registered UnSuccessfully !!!!\n some parameters are empty`)
                this.props.history.push('/Register');
            }
            
    
            else if ( !re.test(this.state.email) ) {
                alert(` email not correct format!! !!!!`)
                this.props.history.push('/Register');
            }

        else if(this.state.password!==this.state.REpassword){
            alert(` password did not match!! !!!!`)
            this.props.history.push('/Register');
        }    
        else{
            
                const user = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    mobile: this.state.mobile,
                    password: this.state.password,
                    location: this.state.location,
                    tenant: this.state.tenant,
                    staff: this.state.staff,
                    admin:this.state.admin ,
                    fnb:this.state.fnb,
                    locked:false,
                    attempts: 0
                };
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    withCredentials: true
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
                    staff: "false",
                    fnb:"false",
                })

                alert(`${this.state.firstName} ${this.state.lastName}  Registered Successfully !!!!`)
                this.props.history.push('/');
            }
            }
        


    render() {
        return (
            <div style={{ 
                backgroundImage: `url(${background})`,  backgroundSize: "cover"
                                }}>
            <div class="container22"  >

                <img src={logo}  width="250" height="250"  margin-bottom="-30" alt="Logo" />
            <div class="container" margin-top="1000" >
            <div ></div>
                <Route path="/" exact component={Login}/>        

                <form onSubmit={this.handleSubmit}>
                    <h1>User Registration</h1>
                    <div class="container1">
                    <label>First Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input id="firstname" type="text" value={this.state.firstName} onChange={this.firsthandler} placeholder="FirstName..." /><br />
                    <label>Last Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input id="lastname" type="text" value={this.state.lastName} onChange={this.lasthandler} placeholder="LastName..." /><br />
                    <label>email id :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input id="emailid" type="text" value={this.state.email} onChange={this.emailhandler} placeholder="email id..." /><br />
                    <label>mobile no :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input id="mobile" type="number" value={this.state.mobile} onChange={this.mobilehandler} placeholder="Mobile number..." /><br />
                    <label>Password :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input id="password" type="password" value={this.state.password} onChange={this.passwordhandler} placeholder="Password..." /><br />
                    <label>RE-Password :&nbsp;&nbsp;</label> <input id="repassword" type="password" value={this.state.REpassword} onChange={this.REpasswordhandler} placeholder="RE-Password..." /><br />

                    <label>location :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><select id="location" onChange={this.locationhandler} defaultValue="">
                        <option defaultValue>Select location</option>
                        <option value="CGH">CGH</option>
                        <option value="KKH">KKH</option>
                        <option value="SGH">SKH</option>
                        <option value="NCCS">NCCS</option>
                        <option value="NDCS">NDCS</option>
                        <option value="NHCS">NHCS</option>
                        <option value="SNEC">SNEC</option>
                        <option value="BVH">BVH</option>
                        <option value="OCH">OCH</option>
                    </select><br />
                    <label>Type of user:</label><select id="usertype" onChange={this.userhandler} defaultValue="">
                        <option defaultValue>Select user</option>
                        <option value="Tenant">Tenant</option>
                        <option value="Staff">staff</option>

                    </select><br />

                    {this.rendervalue()}
                    </div>
                    <input id="submit11" type="submit" value="Submit"  />

                    <li>
                         <label>Sign in? </label>
                        <Link to="/">Login</Link>

                     </li>
                </form >
                </div>
            </div>
            </div>
            
        )
    }
}

export default withRouter(Register)