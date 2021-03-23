import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import { ImUpload3 } from 'react-icons/im';

class Upload extends Component {

    state = {
        selectedFile: null,
        reviewPhotoMsg: "You have not upload any photo",
        numberOfImage: [],
        imageSource: []
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
            </div>
        );
    }

    onChooseFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0
        });
    }

    onUploadButtonHandler = event => {
        event.preventDefault();

        
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        };

        const payload = {
            tableName: "User"
        };

        axios.post("http://localhost:5000/upload_file", payload, headers
        ).then( res => {
            console.log(res.data);
        })
        
        alert("done")
    }
    
}

export default Upload;