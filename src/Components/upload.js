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
        caseID: Date.now().toString(),
        tags: "",
        date: "",
        time: "",
        notes: "",
        staffName: "",
        tenantName: "",
    };

    render() { 
        return (
            <div style={{margin: "10px"}}>
                <Navbar/>
                <h2>Upload photo</h2>
                <div className="border border-dark" style={{display: "inline-block",margin: "10px"}}>
                    <ImUpload3 size="50" style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}/>
                    <input type="file" name="file" onChange={this.onChooseFileHandler} style={{display: "block", margin: '10px'}}/>
                </div>
                <div>
                    <button type="button" className="btn btn-primary m-2" onClick={this.onUploadButtonHandler} >Upload</button>
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

                        <label>date :</label> <input name="date" type="text" value={this.state.date} 
                            onChange={this.dateHandler} placeholder="date..." /><br />
                        <label>time :</label> <input type="text" value={this.state.time} 
                            onChange={this.timeHandler} placeholder="time..." /><br />
                        <label>notes :</label> <input type="text" 
                            value={this.state.notes} onChange={this.notesHandler} placeholder="notes..." /><br />

                        <label>tenant :</label><select onChange={this.tenantHandler} defaultValue="none">
                            <option defaultValue>Select tenant</option>
                            <option value="KFC">KFC</option>
                            <option value="711">711</option>
                            <option value="good tenant">good tenant</option>
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
        axios.get("http://localhost:5000/get_current_username").then(
            res => {
                console.log(res);
                this.setState({staffName: res.data.result});
                console.log("staff name set: " + res.data.result);
            }
        )

        const photo = {
            caseID: this.state.caseID,
            tags: this.state.tags,
            date: this.state.date,
            time: this.state.time,
            notes: this.state.notes,
            staffName: this.state.staffName,
            tenantName: this.state.tenantName
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
    
        axios.post(`http://localhost:5000/upload_photo_info`, photo, headers)
            .then(res => {
                console.log(photo);
                console.log(res);
        })

        alert("photo information upload success!")
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

    dateHandler = (event) => {
        this.setState({
            date: event.target.value
        })
    }


    timeHandler = (event) => {
        this.setState({
            time: event.target.value
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


    onUploadButtonHandler = event => {
        event.preventDefault();

        const data = new FormData();
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        };

        data.append("file", this.state.selectedFile);
        axios.post("http://localhost:5000/upload_file", data, headers
        ).then( res => {
            console.log(data);
            console.log(res.statusText);
        })
        
        alert("Upload success!")
    }

    
}

export default Upload;