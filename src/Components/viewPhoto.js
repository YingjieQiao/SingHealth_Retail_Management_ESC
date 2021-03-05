import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";

class viewPhoto extends Component {

    state = {
        reviewPhotoMsg: "There is no photo in album",
        numberOfImage: [],
        imageSource: []
    };

    
    render() { 
        return (
            <div>
                <Navbar/>
                <h2>View Photos</h2>
                <p>{this.state.reviewPhotoMsg}</p>
                <button type="button" className="btn btn-primary m-2" onClick={this.testHandler}>Update</button>
                <div>
                    { this.state.numberOfImage.map(image => <img src={this.state.imageSource[image]} alt={image} key={image} width="300" height="300" />) }
                </div>
            </div>
        );
    }

    testHandler = event => {
        axios.get("http://localhost:5000/download_file")
        .then(
            res => {
                console.log(res);

                this.setState({reviewPhotoMsg: ""});
                
                for (var i = 0; i < res.data.photoData.length; i++) {
                    let photoData = res.data.photoData[i];
                    let imgsrc = "data:image/jpeg;base64," + photoData;
                    var newImageArray = this.state.imageSource;
                    newImageArray.push(imgsrc);
                    this.setState({imageSource: newImageArray});

                    var newNumberOfImageArray = this.state.numberOfImage;
                    newNumberOfImageArray.push(i);
                    this.setState({numberOfImage: newNumberOfImageArray});
                }

            }
        )

        console.log("done")
    }

}

export default viewPhoto;