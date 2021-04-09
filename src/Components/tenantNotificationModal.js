import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';


class tenantNotificationModal extends Component { 

  state = {
    data: [],
    numOfData: [],
  }

  componentDidMount() {
    axios.get("http://localhost:5000/tenant_get_photo_notification", {withCredentials: true})
    .then(
        res => {
            console.log(res);
            this.setState({data: res.data.tenantData});
            for (let i = 0; i < res.data.tenantData.length; i++){
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
      if (this.state.data[index]["deleted"] === false) {
        return (
          <div>
            <div>
              <label>Sender: {this.state.data[index]["staffName"]}</label>
            </div>
            <div>
              <label>Date: {this.state.data[index]["date"]}</label>
            </div>
            <div>
              <label>Time: {this.state.data[index]["time"]}</label>
            </div>
            <div>
              <label>Rectified: {this.handleRectifyStatus(index)}</label>
            </div>
            <button type="button" id={index} class={this.getReadButtonClasses(index)} onClick={this.handleRead}>{this.handleReadStatus(index)}</button>
            <button type="button" className="btn btn-primary" id={index} onClick={this.handleDelete}>Delete</button>
          </div>
        )
      } else {
        return;
      }
    } catch (e) {

    }

  }

  handleRectifyStatus = (index) => {
    if (this.state.data[index]["rectified"] === true) return "True";
    else return "False";
  }

  handleReadStatus = (index) => {
    if (this.state.data[index]["read"] === true) return "Read";
    else return "Unread";
  }

  handleRead = event => {
    const index = event.target.id;
    var newData = this.state.data;
    newData[index]["read"] = true;
    this.setState({data: newData});

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        withCredentials: true
      };
  
      axios.post("http://localhost:5000/tenant_read_photo_notification", this.state.data[index], headers
      ).then(res => {
        console.log("read: ", res);
       }); 

    } catch (e) {

    }

  }

  handleDelete = event => {
    const index = event.target.id;
    var newData = this.state.data;
    newData[index]["deleted"] = true;
    this.setState({data: newData});

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        withCredentials: true
      };
      axios.post("http://localhost:5000/tenant_delete_photo_notification", this.state.data[index], headers
      ).then(res => {
			console.log(res);
       }); 

    } catch (e) {}

  }


  validateReadStatus = (index) => {
    const status = this.state.data[index]["read"];
    if (status === true) return true;
    else return false;
  }

  getReadButtonClasses(index) {
    let classes = 'btn btn-';
    classes += this.validateReadStatus(index) === false ? 'primary' : 'light';
    return classes;
  }

}

export default tenantNotificationModal;