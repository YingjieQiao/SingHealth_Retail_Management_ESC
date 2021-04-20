import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import { ImUpload3 } from 'react-icons/im';
import mainStyle from './CSS/home.module.css';
import styles from './CSS/upload.module.css';

class Upload extends Component {

    state = {
        selectedFile: null,
        reviewPhotoMsg: "You have not upload any photo",
        numberOfImage: [],
        imageSource: [],
        tags: "",
        date: "",
        time: "",
        notes: "",
        staffName: "",
        tenantName: "",
        rectified: false,
        tenantList: [],
    };

    componentDidMount() {
        try {
            axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
            .then(
                res => {
                    console.log(res.data);
                    if(res.data.username==="" || res.data.username === "UnitTester"){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            );
            axios.get("http://localhost:5000/get_tenant_list", {withCredentials: true})
            .then(
                res => {
                    console.log(res.data);
                    if (res.data.result) {
                        for (var i = 0; i < res.data.tenantList.length; i++) {
                            let newArray1 = this.state.tenantList;
                            newArray1.push(res.data.tenantList[i]);
                            this.setState({tenantList: newArray1});
                        }
                    }
                }
            );
        } catch (e) { console.log(e); }
    }

    render() { 
        return (
        <div><Navbar/>
            <div className={styles.body}>
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Staff Upload Photo</h2>
                </div>
                <div className={styles.upload_container}>
                    <ImUpload3 size="50" className={styles.upload_icon}/>
                    <div className={styles.chooseFile_container}>
                        <input type="file" name="file" onChange={this.onChooseFileHandler} 
                            className={styles.chooseFile}/>
                    </div>
                </div>

                <div className={styles.info_body}>
                    <form>
                        <div className={mainStyle.header_container}>
                            <h1 className={mainStyle.header}>Photo Information</h1>
                        </div>

                        <label className={styles.info_label}>Tags:</label><select id="select" onChange={this.tagsHandler} defaultValue="none">
                            <option defaultValue>Select tags</option>
                            <option value="Professionalism and Staff Hygiene">Professionalism and Staff Hygiene</option>
                            <option value="HouseKeeping and General Cleanliness">HouseKeeping and General Cleanliness</option>
                            <option value="Food Hygiene">Food Hygiene</option>
                            <option value="Healthier Choic">Healthier Choice</option>
                            <option value="Workplace Safety and Health">Workplace Safety and Health</option>
                        </select><br />
                        
                        <label className={styles.info_label}>Notes:</label> <input type="text" id="notes"
                            value={this.state.notes} onChange={this.notesHandler} placeholder="Write a note to the tenant..." /><br />

                        <label className={styles.info_label}>Tenant:</label><select id= "tenant" onChange={this.tenantHandler} defaultValue="none">
                            <option defaultValue>Select tenant</option>
                            { this.state.tenantList.map(tenant => <option value={tenant} key={tenant}>{tenant}</option> ) }
                        </select><br />

                    </form >

                    <div className={styles.button_container}>
                        <button type="button" className="btn btn-primary m-2" 
                            onClick={this.photoInfoButtonHandler} >Upload Photo Information</button>
                    </div>
                </div>
            </div>
            </div>
            
        );
    }


    photoInfoButtonHandler = (event) => {
        event.preventDefault()

        // set staff username
        axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true}).then(
            res => {
                console.log(res);
                // this.setState({staffName: res.data.result});
                this.setState({staffName: res.data.username,
                    time: res.data.time, date: res.data.date}, this.checkStaffName);
                console.log("staff name set: " + res.data.username + " and time set: " + res.data.time);
            }
        )
    }

    checkStaffName = () => {
        if (this.state.staffName.length !== 0) {
            // proceeds to upload info
            const photo = {
                tags: this.state.tags,
                date: this.state.date,
                time: this.state.time,
                notes: this.state.notes,
                staffName: this.state.staffName,
                tenantName: this.state.tenantName,
                rectified: this.state.rectified
            };
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                withCredentials: true
            };
        
            axios.post(`http://localhost:5000/upload_photo_info`, photo, headers)
                .then(res => {
                    console.log(photo);
                    console.log(res);
            })
            
            // upload photo to S3 after uploading notes
            const data = new FormData();

            data.append("file", this.state.selectedFile);
            data.append("time", this.state.time)
            data.append("date", this.state.date)
            data.append("staffName", this.state.staffName)
            data.append("tenantName", this.state.tenantName)
            axios.post("http://localhost:5000/upload_file", data, headers
            ).then( res => {
                console.log(data);
                console.log(res.statusText);
            })
                
            alert("photo information upload success!");
        } else {
            // Not allowed to upload info
            alert("staff name is empty");
        }
    }


    tenantHandler = (event) => {
        this.setState({
            tenantName: event.target.value
        })
    }

    notesHandler = (event) => {
        this.setState({
            notes: event.target.value
        })
    }


    tagsHandler = (event) => {
        this.setState({
            tags: event.target.value
        })
    }


    onChooseFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0
        });
    }
    
}

export default Upload;