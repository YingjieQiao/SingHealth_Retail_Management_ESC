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
        rectified: false
    };

    render() { 
        return (
            <div style={{margin: "10px"}}>
                <Navbar/>
                <h2>Upload photo</h2>
                <div className="border border-dark" style={{display: "inline-block",margin: "10px"}}>
                    <ImUpload3 size="50" style={{display: "block", marginLeft: "auto", 
                        marginRight: "auto", marginTop: "10px"}}/>
                    <input type="file" name="file" onChange={this.onChooseFileHandler} 
                        style={{display: "block", margin: '10px'}}/>
                </div>

                <div>
                    <form>
                        <h1>Photo Information</h1>

                        <label>tags :</label><select onChange={this.tagsHandler} defaultValue="none">
                            <option defaultValue>Select tags</option>
                            <option value="tag1">tag1</option>
                            <option value="tag2">tag2</option>
                            <option value="tag3">tag3</option>
                        </select><br />
                        
                        <label>notes :</label> <input type="text" 
                            value={this.state.notes} onChange={this.notesHandler} placeholder="notes..." /><br />

                        <label>tenant :</label><select onChange={this.staffHandler} defaultValue="none">
                            <option defaultValue>Select staff to answer to</option>
                            <option value="KFC">YingjieQiao</option>
                            <option value="711">CarlJohnson</option>
                            <option value="good tenant">good staff</option>
                        </select><br />

                    </form >

                    <div>
                        <button type="button" className="btn btn-primary m-2" 
                            onClick={this.photoInfoButtonHandler} >Upload Photo Information</button>
                    </div>
                </div>
            </div>

            
        );
    }


    photoInfoButtonHandler = (event) => {
        event.preventDefault()

        // set staff username
        axios.get("http://localhost:5000/get_current_username_and_datetime").then(
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
        if (this.state.staffName.length != 0) {
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
                'Access-Control-Allow-Origin': '*'
            };
        
            axios.post(`http://localhost:5000/tenant_upload_photo_info`, photo, headers)
                .then(res => {
                    console.log(photo);
                    console.log(res);
            })
            
            // upload photo to S3 after uploading notes
            const data = new FormData();

            data.append("file", this.state.selectedFile);
            data.append("time", this.state.time)
            data.append("date", this.state.date)
            axios.post("http://localhost:5000/tenant_upload_file", data, headers
            ).then( res => {
                console.log(data);
                console.log(res.statusText);
            })
                
            alert("photo information upload success!");
        } else {
            // Not allowed to upload info
            alert("tenant name is empty");
        }
    }


    staffHandler = (event) => {
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