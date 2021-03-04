import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import { ImUpload3 } from 'react-icons/im';

class Upload extends Component {

    state = {
        selectedFile: null,
        reviewPhotoMsg: "You have not upload any photo",
        numberOfImage: [],
        imageSource: ""
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
                <h2>Review photo</h2>
                <p>{this.state.reviewPhotoMsg}</p>
                <button type="button" className="btn btn-primary m-2" onClick={this.testHandler}>Update</button>
                <div>
                    { this.state.numberOfImage.map(image => <img src={this.state.imageSource} alt="image" key={image} width="300" height="300" />) }
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

        const data = new FormData();
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        };

        data.append("file", this.state.selectedFile);
        axios.post("http://localhost:5000/upload_file", data, headers
        ).then( res => {
            console.log(data);
            // console.log(data.file)
            console.log(res.statusText);
        })
        this.setState({reviewPhotoMsg: ""});
    }


    testHandler = event => {
        axios.get("http://localhost:5000/download_file")
        .then(
            res => {
                console.log(res);
                
                for (var i = 0; i < res.data.photoData.length; i++) {
                    let photoData = res.data.photoData[i];
                    let imgsrc = "data:image/jpeg;base64," + photoData;
                    this.setState({imageSource: imgsrc});
                    this.setState({numberOfImage: [this.state.numberOfImage, i]});
                }

            }
        )

        console.log("done")
    }
    
}

export default Upload;