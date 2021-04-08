
import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';
import TenantNotificationModal from './tenantNotificationModal';

class tenantHome extends Component { 

  state = {
    numOfData: [],
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
    )

    axios.get("http://localhost:5000/tenant_get_photo_notification", {withCredentials: true})
    .then(
        res => {
            console.log("start: ", res);
            const data = res.data.tenantData;
            for (let i = 0; i < data.length; i++){
              var newNumOfData = this.state.numOfData;
              if (data[i]["deleted"] === false) {
                newNumOfData.push(i);
                this.setState({numOfData: newNumOfData});
              }
            } 
          }
        )
  }
  render() {
    return (
      <div className='home'>
        <TenantNavbar/>
        <h1>Tenant User Homepage</h1>
        <div>
          {this.displayInfo()}
        </div>
      </div>
    )
  }

  displayInfo() {
    try {
      if (this.state.numOfData.length !== 0) {
        return <TenantNotificationModal />;
      } else {
        return (
          <div>
            <label>No notification.</label>
          </div>
        )
      }
    } catch (e) {}
  }

}


export default tenantHome;

