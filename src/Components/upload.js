import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import { ImUpload3 } from 'react-icons/im';

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
                    if(res.data.username==""){
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
            <div style={{margin: "10px"}}>
                
                <h2>Staff Upload photo</h2>
                <div className="border border-dark" style={{display: "inline-block",margin: "10px"}}>
                    <ImUpload3 size="50" style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}/>
                    <input type="file" id= "choose" name="file" onChange={this.onChooseFileHandler} style={{display: "block", margin: '10px'}}/>
                </div>

                <div>
                    <form>
                        <h1>Photo Information</h1>

                        <label>Tags:</label><select id="select" onChange={this.tagsHandler} defaultValue="none">
                            <option defaultValue>Select tags</option>
                            <option value="Professionalism and Staff Hygiene">Professionalism and Staff Hygiene</option>
                            <option value="HouseKeeping and General Cleanliness">HouseKeeping and General Cleanliness</option>
                            <option value="Food Hygiene">Food Hygiene</option>
                            <option value="Healthier Choic">Healthier Choice</option>
                            <option value="Workplace Safety and Health">Workplace Safety and Health</option>
                        </select><br />
                        
                        <label>Notes:</label> <input type="text" id="notes"
                            value={this.state.notes} onChange={this.notesHandler} placeholder="notes..." /><br />

                        <label>Tenant:</label><select id= "tenant" onChange={this.tenantHandler} defaultValue="none">
                            <option defaultValue>Select tenant</option>
                            { this.state.tenantList.map(tenant => <option value={tenant} key={tenant}>{tenant}</option> ) }
                        </select><br />

                    </form >

                    <div>
                        <button type="button" id="button" className="btn btn-primary m-2" 
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