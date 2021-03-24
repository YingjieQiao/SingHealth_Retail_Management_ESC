import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";

class viewPhoto extends Component {

    state = {
        reviewPhotoMsg: "There is no photo in album",
        numberOfImage: [],
        imageSource: [],
        photoAttrData: []
    };

    
    render() { 
        return (
            <div>
                <Navbar/>
                <h2>View Photos</h2>
                <p>{this.state.reviewPhotoMsg}</p>
                <button type="button" className="btn btn-primary m-2" onClick={this.testHandler}>Update</button>
                <div>
                    {this.state.numberOfImage.map(image => {
                        return(
                            <div>
                                <img src={this.state.imageSource[image]} alt={image} key={image} width="300" height="300" /> 
                                <p>Tags: {this.handleInfo(image, "tags")}</p>
                                <p>Date: {this.handleInfo(image, "date")}, {this.handleInfo(image, "time")}</p>
                                <p>Notes: {this.handleInfo(image, "notes")}</p>
                                <p>Staff's Name: {this.handleInfo(image, "staffName")}</p>
                                <p>Tenant's Name: {this.handleInfo(image, "tenantName")}</p>
                                <p>Rectified: {this.handleInfo(image, "rectified")}</p>
                                <button type="button" id={image} onClick={this.rectify} className="btn btn-primary m-2">Rectify</button>
                            </div>
                        )
                    })}
                </div>

            </div>
        );
    }

    handleInfo = (index, data) => {
        if (this.state.photoAttrData.length === 0){
            return "-";
        } else {
            switch (data) {
                case "tags":
                    return this.state.photoAttrData[index]["tags"];
                case "date":
                    return this.state.photoAttrData[index]["date"];
                case "time":
                    return this.state.photoAttrData[index]["time"];
                case "notes":
                    return this.state.photoAttrData[index]["notes"];
                case "staffName":
                    return this.state.photoAttrData[index]["staffName"];
                case "tenantName":
                    return this.state.photoAttrData[index]["tenantName"];
                case "rectified":
                    if (this.state.photoAttrData[index]["rectified"]) {
                        return "true";
                    } else {
                        return "false";
                    }
                default:
                    return "-";
            }
        }
    }

    testHandler = event => {
        axios.get("http://localhost:5000/download_file")
        .then(
            res => {
                console.log(res);
                // res.photoAttrData is an array of dictionary, each dictionary contains the info about this photo

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

                // store res.data.photoAttrData in state variable
                const photoAttrArr = res.data.photoAttrData;
                let photoAttr = [];
                for (var i = 0; i < photoAttrArr.length; i++) {
                    for (var j = 0; j < photoAttrArr[i].length; j++) {
                        photoAttr.push(photoAttrArr[i][j]);
                    }
                }
                this.setState({photoAttrData: photoAttr});
            }
        )

        console.log("done");
    }

    rectify = event => {
        event.preventDefault();

        const index = event.target.id;

        var newPhotoAttr = this.state.photoAttrData;
        newPhotoAttr[index]["rectified"] = true;
        this.setState({photoAttrData: newPhotoAttr});

        let newNumArray = this.state.numberOfImage;
        newNumArray.splice(index, 1);
        let orArray = this.state.imageSource
        orArray.splice(index, 1);
        let newPhotoAttrData = this.state.photoAttrData;
        newPhotoAttrData.splice(index, 1);
        this.setState({
            imageSource: orArray,
            numberOfImage: newNumArray,
            photoAttrData: newPhotoAttrData
        });

        console.log("newArray: ", this.state.photoAttrData);
        
    }



}

export default viewPhoto;