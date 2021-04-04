import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';


class tenantNotificationModal extends Component { 

  state = {
    data: null,
    readStatusArray: [],
    numOfData: [],
  }

  componentDidMount() {
    axios.get("http://localhost:5000/tenant_get_photo_notification")
    .then(
        res => {
            console.log(res);
            this.setState({data: res.data["tenantData"]});

            for (let i = 0; i < res.data.tenantData.length; i++){
              var newReadStatusArray = this.state.readStatusArray;
              newReadStatusArray[i] = "Unread";
              this.setState({readStatusArray: newReadStatusArray});
              var newNumOfData = this.state.numOfData;
              newNumOfData[i] = i;
              this.setState({numOfData: newNumOfData});
            }
        }
    )
  }

  render() {
    return (
      <div>
        {this.state.numOfData.map(index => { 
          return (
            <div>{this.displayInfo(index)}</div>
          )
        })}
      </div>
    )
  }

  displayInfo = (index) => {
    try {
      return (
        <div>
          <div>
            <label>Sender: {this.state.data[index]["staffName"]}</label>
          </div>
          <div>
            <label>Rectified: {this.handleRectifyStatus(index)}</label>
          </div>
          <button type="button" id={index} class={this.getReadButtonClasses(index)} onClick={this.handleRead}>{this.state.readStatusArray[index]}</button>
          <button type="button" className="btn btn-primary" id={index} onClick={this.handleDelete}>Delete</button>
        </div>
      )
    } catch (e) {

    }

  }

  handleRectifyStatus = (index) => {
    if (this.state.data[index]["rectified"] === false) {
      return "False";
    }
  }

  handleRead = event => {
    var newReadStatusArray = this.state.readStatusArray;
    newReadStatusArray[event.target.id] = "Read";
    this.setState({readStatusArray: newReadStatusArray});

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
    var newData = this.state.data;
    newData.splice(event.target.id, 1);
    this.setState({data: newData});

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

  validateReadStatus = (index) => {
    const status = this.state.readStatusArray[index];
    if (status === "Read") {
      return true;
    } else  {
      return false;
    }
  }

  getReadButtonClasses(index) {
    let classes = 'btn btn-';
    classes += this.validateReadStatus(index) === false ? 'primary' : 'light';
    return classes;
  }

}

export default tenantNotificationModal;