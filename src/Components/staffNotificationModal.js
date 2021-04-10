import React, { Component } from 'react';
import axios from 'axios';
import styles from './CSS/notification.module.css';
import * as AiIcons from 'react-icons/ai';
 

class stafftNotificationModal extends Component { 

  state = {
    data: [],
    numOfData: [],
  }

  componentDidMount() {
    axios.get("http://localhost:5000/staff_get_photo_notification", { withCredentials: true })
    .then(
        res => {
            console.log(res);
            this.setState({data: res.data.staffData});
            for (let i = 0; i < res.data.staffData.length; i++){
              var newNumOfData = this.state.numOfData;
              newNumOfData[i] = i;
              this.setState({numOfData: newNumOfData});
            }
        }
    )
  }

  render() {
    return (
      <div className={styles.body}>
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
          <div className={styles.single_noti_body} id={index} >
            <div className={styles.button_container} id={index}>
              <button type="button" className={styles.delete_button} id={index} onClick={this.handleDelete}>Delete</button>
            </div>
            <div className={styles.container_1} id={index}>
                <div className={styles.sender_container} id={index}>
                  <label className={styles.sender_heading} id={index}>Sender: {this.state.data[index]["tenantName"]} <span id={index} style={this.getReadButtonClasses(index)} onClick={this.handleRead}>{this.handleReadStatus(index)}</span></label>
                </div>
                <div className={styles.date_container} id={index}>
                  <label className="text-muted" id={index}><AiIcons.AiOutlineClockCircle id={index}/>{this.state.data[index]["date"]}, {this.state.data[index]["time"]}</label>
                </div>
              </div>
              <div className={styles.note_container} id={index}>
                <label id={index}>{this.state.data[index]["notes"]}</label>
              </div>
              <div className={styles.container_2} id={index}>
                <div className={styles.rectify_badge_container} id={index}>
                  <span className={styles.rectify_badge} id={index}>
                    <label className={styles.rectify} id={index}>Rectified: {this.handleRectifyStatus(index)}</label>
                  </span>
                </div>
                <div className={styles.tag_badge_container} id={index}>
                  <span className={styles.tag_badge} id={index}>
                    <label className={styles.tag} id={index}>Tags: {this.state.data[index]["tags"]}</label>
                  </span>
                </div>
              </div>

            {/* <button type="button" id={index} class={this.getReadButtonClasses(index)} onClick={this.handleRead}>{this.handleReadStatus(index)}</button> */}
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
  
      axios.post("http://localhost:5000/staff_read_photo_notification", this.state.data[index], headers
      ).then(res => {
        console.log("read: ", res);
       }); 

    } catch (e) {

    }

  }

  handleDelete = event => {
    const index = event.target.id;
    var newData = this.state.data;
    console.log("index: ", event.target.value);
    newData[index]["deleted"] = true;
    this.setState({data: newData});

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        withCredentials: true
      };
      axios.post("http://localhost:5000/staff_delete_photo_notification", this.state.data[index], headers
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
    let classes = {
      borderRadius: "5px",
      fontSize: "small",
      fontWeight: "bold",
      padding: "5px",
    }

    if (this.validateReadStatus(index) === false ) {
      classes["backgroundColor"] = "#40bcd8";
      classes["color"] = "#f8f7ff";
      classes["cursor"] = "pointer";
    } else {
      classes["backgroundColor"] = "#e9ecef";
      classes["cursor"] = "default";
    }
    // let classes = 'btn btn-';
    // classes += this.validateReadStatus(index) === false ? 'primary' : 'light';
    return classes;
  }

}

export default stafftNotificationModal;