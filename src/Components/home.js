import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import StaffNotificationModal from './staffNotificationModal';

class Home extends Component { 

  state = {
    numOfData: [],
  }

  componentDidMount() {
    axios.get("http://localhost:5000/staff_get_photo_notification", {withCredentials: true})
    .then(
        res => {
            console.log("start: ", res);
            const data = res.data.staffData;
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
      <div className='home' style={{backgroundColor: '#f5f3f4', height: '100vh'}}>
            <Navbar usertype="staff" />
            <h1>Staff User Homepage</h1>
            <h2>Notification</h2>
        <div>
          {this.displayInfo()}
        </div>
      </div>
    )
  }

  displayInfo() {
    try {
      if (this.state.numOfData.length !== 0) {
        return <StaffNotificationModal />;
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

export default Home;

