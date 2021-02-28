import React, { Component } from 'react';
import axios from "axios";
import { ImUpload3 } from 'react-icons/im';

class Upload extends Component {

    state = {
        selectedFile: null,
        reviewPhotoMsg: "You have not upload any photo"
    };

    render() { 
        return (
            <div style={{margin: "10px"}}>
                <h2>Upload photo</h2>
                <div className="border border-dark" style={{display: "inline-block",margin: "10px"}}>
                    <ImUpload3 size="50" style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}/>
                    <input type="file" name="file" onChange={this.onChooseFileHandler} style={{display: "block", margin: '10px'}}/>
                </div>
                
                <button type="button" className="btn btn-success m-2" onClick={this.onUploadButtonHandler} style={{display: "block", alignItems: "center"}}>Upload</button>

                <h2>Review photo</h2>
                <p>{this.state.reviewPhotoMsg}</p>
                <button type="button" className="btn btn-success m-2">Submit</button>
            </div>
        );
    }

    onChooseFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0
        });
    }

    onUploadButtonHandler = () => {
        const data = new FormData();
        data.append("file", this.state.selectedFile);
        axios.post("http://localhost:5000/upload", data, {
        }).then( res => {
            console.log(res.statusText);
        })
        this.setState({reviewPhotoMsg: ""});
    }
    
}
 
export default Upload;