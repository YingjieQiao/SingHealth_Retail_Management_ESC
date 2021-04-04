import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';


// function tenantHome() {
//   localStorage.setItem("usertype","tenant")  ;
//   return (
//     <div className='home'>
//             <TenantNavbar/>
//         <h1>Tenant User Homepage</h1>
//     </div>
//   );
// }

class tenantHome extends Component { 

  state = {
    data: null,
    readStatus: "Unread"
  }

  componentDidMount() {
    axios.get("http://localhost:5000/tenant_get_photo_notification")
    .then(
        res => {
            console.log(res);
            this.setState({data: res.data});
        }
    )
  }

  render() {
    return (
      <div className='home'>
        <TenantNavbar/>
        <h1>Tenant User Homepage</h1>
        <div>
          <button type="button" class={this.getButtonClasses()} onClick={this.handleRead}>{this.state.readStatus}</button>
        </div>
      </div>
    )
  }

  displayInfo() {
    if (true) {
      //display
    }
  }

  handleRead = event => {
    this.setState({readStatus: "Read"});

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      };
  
      axios.post("http://localhost:5000/tenant_read_photo_notification", this.state.data, headers
      ).then(res => {
  
       }); 
    } catch (e) {

    }

  }

  handleDelete = event => {
    // false to true

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      };
  
      axios.post("http://localhost:5000/tenant_delete_photo_notification", this.state.data, headers
      ).then(res => {
  
       }); 
    } catch (e) {

    }
  }

  validateReadStatus = () => {
    const status = this.state.readStatus;
    if (status === "Read") {
      return true;
    } else  {
      return false;
    }
  }

  getButtonClasses() {
    let classes = 'btn btn-';
    classes += this.validateReadStatus() === false ? 'light' : 'primary';
    return classes;
  }

}

export default tenantHome;