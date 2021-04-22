import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from "axios";
import mainStyle from './CSS/home.module.css';
import stylesBagde from './CSS/badge.module.css';
import stylesNoti from './CSS/notification.module.css';
import styles from './CSS/viewPhoto.module.css';
import * as AiIcons from 'react-icons/ai';
import background from './logo/background.jpg';
class viewPhoto extends Component {

    state = {
        reviewPhotoMsg: "There is no photo in album",
        numberOfImage: [],
        imageSource: [],
        photoAttrData: [],
        tenantNumOfImage: [],
        tenantImgSrc: [],
        tenantPhotoAttrData: [],
        showPhotoByStaff: false,
        showPhotoByTenant: false,
    };

    componentDidMount() {
        try {
            axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
            .then(
                res => {
                    console.log(res.data);
                    if(res.data.username==="" || res.data.username==="UnitTester"){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            );
        } catch (e) { console.log(e); }
    }

    render() { 
        return (
            
            <div className={mainStyle.body}>
                <Navbar/>
                <div style={{ 
                backgroundImage: `url(${background})`,  backgroundSize: "cover"
                                }}>
                <div class="container21" >
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Staff View Photos</h2>
                </div>
                <div className={styles.button_container}>
                    <button type="button" class={this.getTenantButtonClasses()} onClick={this.showPhotoByTenantHandler}>View Photos Uploaded By Tenants</button>
                    <button type="button" class={this.getStaffButtonClasses()} onClick={this.showPhotoByStaffHandler}>View Previously Updated Photos</button>
                </div>
                <div className={styles.header_container}><h2 className={styles.header}>{this.displayUploadHeader()}</h2></div>
                <div>
                    {this.state.numberOfImage.map(image => {
                        return(
                            <div className={styles.single_photo_body}>
                                <div className={styles.image_container}>
                                    <img src={this.state.imageSource[image]} alt={image} key={image} width="300" height="300" /> 
                                </div>
                                <div className={styles.date_container}>
                                    <label className="text-muted"><AiIcons.AiOutlineClockCircle/> {this.handleInfo(image, "date")}, {this.handleInfo(image, "time")}</label>
                                </div>
                                <div className={stylesNoti.container_1}>
                                    <div className={stylesNoti.sender_container}>
                                        <label className={stylesNoti.sender_heading}>Uploaded by: {this.displayUploaderInfo(image)}</label>
                                    </div>
                                </div>                                
                                <div className={stylesNoti.note_container}>
                                    <label>Notes: {this.handleInfo(image, "notes")}</label>
                                </div>
                                <div className={stylesBagde.badge_container}>
                                    <span className={stylesBagde.badge_tag}>
                                        <label className={stylesBagde.badge_text}>Tags: {this.handleInfo(image, "tags")}</label>
                                    </span>
                                </div>
                                <div className={styles.rectifyButton_container}>
                                    <button type="button" id={image} onClick={this.rectify} className="btn btn-primary m-2" width="wrap">Rectify &nbsp;&nbsp;</button>
                                </div>
                            </div>

                        )
                    })}
                </div>

            </div></div> </div>
        );
    }

    displayUploadHeader = () => {
        if (this.state.showPhotoByStaff) return "View Photos Uploaded by you."; 
        else if (this.state.showPhotoByTenant) return "View Photos Uploaded by tenants.";
    }

    displayUploaderInfo = (image) => {
        if (this.state.showPhotoByStaff) return this.handleInfo(image, "staffName"); 
        else if (this.state.showPhotoByTenant) return this.handleInfo(image, "tenantName");
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

    showPhotoByStaffHandler = event => {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true
        };

        const payload = {
            'counterPart': false
        };

        axios.post("http://localhost:5000/download_file", payload, headers)
        .then(
            res => {
                console.log(res);
                // res.photoAttrData is an array of dictionary, 
                // each dictionary contains the info about this photo

                this.setState({reviewPhotoMsg: "", showPhotoByStaff: true, showPhotoByTenant: false});

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

        this.setState({
            reviewPhotoMsg: "There is no photo in album",
            numberOfImage: [],
            imageSource: [],
            photoAttrData: []
        })
    }


    showPhotoByTenantHandler = event => {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true
        };

        const payload = {
            'counterPart': true
        };

        axios.post("http://localhost:5000/download_file", payload, headers)
        .then(
            res => {
                console.log(res);
                // res.photoAttrData is an array of dictionary, each dictionary contains the info about this photo

                this.setState({reviewPhotoMsg: "", showPhotoByStaff: false, showPhotoByTenant: true});

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

        console.log("showPhotoByTenantHandler");

        this.setState({
            reviewPhotoMsg: "There is no photo in album",
            numberOfImage: [],
            imageSource: [],
            photoAttrData: []
        })
    }

    rectify = event => {
        event.preventDefault();

        const index = event.target.id;

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            withCredentials: true
        };
        
        const currPhoto = {
            tags: this.state.photoAttrData[index]["tags"],
            date: this.state.photoAttrData[index]["date"],
            time: this.state.photoAttrData[index]["time"],
            notes: this.state.photoAttrData[index]["notes"],
            staffName: this.state.photoAttrData[index]["staffName"],
            tenantName: this.state.photoAttrData[index]["tenantName"],
            rectified: this.state.photoAttrData[index]["rectified"]
        };

        if (this.state.viewStaffUpload) {
            axios.post(`http://localhost:5000/rectify_photo`, currPhoto, headers)
            .then(res => {
                console.log(currPhoto);
                console.log(res);
            });
        } 
        else if (this.state.viewTenantUpload) {
            axios.post(`http://localhost:5000/tenant_rectify_photo`, currPhoto, headers)
            .then(res => {
                console.log(currPhoto);
                console.log(res);
            });
        }

        let newPhotoAttr = this.state.photoAttrData;
        newPhotoAttr[index]["rectified"] = true;
        this.setState({photoAttrData: newPhotoAttr});

        let newNumArray = this.state.numberOfImage;
        newNumArray.pop();

        let newImgArray = this.state.imageSource
        newImgArray.splice(index, 1);

        let newPhotoAttrData = this.state.photoAttrData;
        newPhotoAttrData.splice(index, 1);

        this.setState(imageSource => {return newImgArray});
        this.setState(photoAttrData => {return newPhotoAttrData});
        this.setState(numberOfImage => {return newImgArray});
        
    }

    uploadedByStaff = () => {
        if (this.state.showPhotoByStaff) return true;
        else return false;
    }
    
    getStaffButtonClasses = () => {
        let classes = 'btn m-2 btn-'
        classes += this.uploadedByStaff() === true ? 'secondary' : 'primary';
        return classes;
    }

    uploadedByTenant = () => {
        if (this.state.showPhotoByTenant) return true;
        else return false;
    }
    
    getTenantButtonClasses = () => {
        let classes = 'btn m-2 btn-'
        classes += this.uploadedByTenant() === true ? 'secondary' : 'primary';
        return classes;
    }


}

export default viewPhoto;