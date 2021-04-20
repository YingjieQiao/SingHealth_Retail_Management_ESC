import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from "axios";
import mainStyle from './CSS/home.module.css';
import stylesBagde from './CSS/badge.module.css';
import stylesNoti from './CSS/notification.module.css';
import styles from './CSS/viewPhoto.module.css';
import * as AiIcons from 'react-icons/ai';

class viewPhoto extends Component {

    state = {
        reviewPhotoMsg: "There is no photo in album.",
        numberOfImage: [],
        imageSource: [],
        photoAttrData: [],
        showPhotoByStaff: false,
        showPhotoByTenant: false,
    };

    componentDidMount() {

        axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
        .then(
            res => {
                console.log(res.data);
                if(res.data.username===""||res.data.username==="UnitTester"){
                  alert("Please Log in!");
                  this.props.history.push('/');
                }
            }
        )}

    render() { 
        return (
            <div className={mainStyle.body}>
                <TenantNavbar/>
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Tenant View Photos</h2>
                </div>
                <div className={styles.button_container}>
                    <button type="button" class={this.getStaffButtonClasses()} onClick={this.showPhotoByStaffHandler}>View Photos Uploaded By Staff</button>
                    <button type="button" class={this.getTenantButtonClasses()} onClick={this.showPhotoByTenantHandler}>View Previously Uploaded Photos</button>
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
                                <span className={stylesBagde.badge_tag}>
                                    <label className={stylesBagde.badge_text}>Tags: {this.handleInfo(image, "tags")}</label>
                                </span>
                            </div>
                        )
                    })}
                </div>
                <label className={styles.noPhotoLabel}>{this.state.reviewPhotoMsg}</label>

            </div>
        );
    }

    displayUploadHeader = () => {
        if (this.state.showPhotoByStaff) return "View Photos Uploaded by staff."; 
        else if (this.state.showPhotoByTenant) return "View Photos Uploaded by you.";
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

    showPhotoByTenantHandler = event => {
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
                // res.photoAttrData is an array of dictionary, each dictionary contains the info about this photo

                this.setState({reviewPhotoMsg: "", showPhotoByTenant: true, showPhotoByStaff: false});
                
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
            reviewPhotoMsg: "There is no photo in album.",
            numberOfImage: [],
            imageSource: [],
            photoAttrData: []
        })
    }

    showPhotoByStaffHandler = event => {
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

                this.setState({reviewPhotoMsg: "", showPhotoByTenant: false, showPhotoByStaff: true});

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

        console.log("showPhotoByStaffHandler");

        this.setState({
            reviewPhotoMsg: "There is no photo in album.",
            numberOfImage: [],
            imageSource: [],
            photoAttrData: []
        })
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