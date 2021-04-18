import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import styles from './CSS/dataDashboard.module.css';
import mainStyle from './CSS/home.module.css';
import uploadStyle from './CSS/upload.module.css';

class DataDashboardCompareTenant extends Component {

    state = {
        institute1: this.props.location.state.compareTenantList["institute1"],
        institute2: this.props.location.state.compareTenantList["institute2"],
        instituteName1: this.props.location.state.compareTenantList["instituteName1"],
        instituteName2: this.props.location.state.compareTenantList["instituteName2"],
        timeChoice: "default",
        dataDict: {},
        isReportAvail: false,
        emailContent: {
            email: [],
            subject: "",
            body: "",
        },
        emailList: [],
        numOfReceiver: [],
    }


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

            const data = {
                institute1: this.state.institute1,
                institute2: this.state.institute2,
            };

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                withCredentials: true
            };

            axios.post("http://localhost:5000/compare_tenant", data, headers)
            .then(
                res => {
                    console.log(res);
                    this.setState({dataDict: res.data})
                }
            )

            axios.get("http://localhost:5000/staff_list", {withCredentials: true})
            .then(
                res => {
                    if (res.data.result) {
                        console.log(res);
                        for (var i = 0; i < res.data.tenant_list.length; i++) {
                            let newArray1 = this.state.emailList;
                            newArray1.push(res.data.tenant_list[i]["email"]);
                            this.setState({emailList: newArray1});
                        }
                    }
                }
            );

            axios.get("http://localhost:5000/tenant_list", {withCredentials: true})
            .then(
                res => {
                    if (res.data.result) {
                        console.log(res);
                        for (var i = 0; i < res.data.tenant_list.length; i++) {
                            let newArray2 = this.state.emailList;
                            newArray2.push(res.data.tenant_list[i]["email"]);
                            this.setState({emailList: newArray2});
                        }
                    }
                }
            );
        } catch (e) { console.log(e); }
    }

    render() {

        return (
            <div className={uploadStyle.body}>
                <Navbar/>
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Data Dashboard</h2>
                </div>
                <div className={uploadStyle.info_body}>
                    <div className={mainStyle.header_container}>
                        <h1 className={mainStyle.header}>{this.state.instituteName1}'s v.s. {this.state.instituteName2}'s Performance Score</h1>
                    </div>

                    <label className={uploadStyle.info_label}>Select a statistic to be displayed:</label>
                    <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.saveSelection}>
                        <option selected value="default">Choose...</option>
                        <option value="year" key="year">Yearly</option>
                        <option value="month" key="month">Monthly</option>
                        <option value="week" key="week">Weekly</option>
                        <option value="day" key="day">7 days</option>
                    </select><br />
                </div>
                <div>{this.displayImage()}</div>
                <div className={styles.button_container}>{this.displayExportButton()}</div>
            </div>
        )
    }

    saveSelection = event => {
        this.setState({
            timeChoice: event.target.value
        });
    }

    displayImage = () => {
        if (this.state.timeChoice !== "default") {
            const imageName = "audit_" + this.state.timeChoice + "_img";
            const validateImage = this.checkIfImageExist(imageName);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return (
                <div style={{margin: "40px auto 20px auto"}}>
                    <h3 className={mainStyle.header}>{this.displayImageHeading(index)}</h3>
                    <img src={this.getImagesrc(imageName)} alt={imageName} key={index} width="500" height="500" />  
                </div> );
            }
            else {
                return <p style={{fontStyle: 'italic'}} className="text-primary">No available statistics is found.</p>;
            }
        } else {
            return <p style={{fontStyle: 'italic'}} className="text-info">Please choose a statistic to be displayed.</p>;
        }
    }

    checkIfImageExist = (data) => {
        try {
            const val = this.state.dataDict[data];
            if (val === null || val === undefined){
                return false;
            }
            else if (val !== ""){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    displayImageHeading = (index) => {
        switch (index) {
            case "year":
                return "Yearly Statistics";
            case "month":
                return "Monthly Statistics";
            case "week":
                return "Weekly Statistics";
            case "day":
                return "7 Days Statistics";
            default:
                return "No statistics available";
        }
    }

    getImagesrc = (index) => {
        return "data:image/png;base64," + this.state.dataDict[index];
    }

    displayExportButton = () => {
        if (this.state.timeChoice !== "default") {
            const imageName = "audit_" + this.state.timeChoice + "_img";
            const validateImage = this.checkIfImageExist(imageName);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return <button type="button" className="btn btn-primary" id={index} onClick={this.handleExport}>Export {this.displayButtonLabel(index)} Graph to excel</button>;
            }
            else {
                return <button type="button" className="btn btn-secondary" style={{visibility: 'hidden'}} disabled>Export Graph to excel</button> ;
            }
        } else {
            return <button type="button" className="btn btn-secondary" style={{visibility: 'hidden'}} disabled>Export Graph to excel</button> ;
        }
    }

    displayButtonLabel = (index) => {
        switch (index) {
            case "year":
                return "Yearly";
            case "month":
                return "Monthly";
            case "week":
                return "Weekly";
            case "day":
                return "7 Days";
            default:
                break;
        }
    }


    handleExport = (event) => {
        try {
            const csvName1 = "audit_" + this.state.timeChoice + "_csv_1";
            const csvName2 = "audit_" + this.state.timeChoice + "_csv_2";
            var csvRows = [];
            var twoDiArray_1 = this.state.dataDict[csvName1];
            var twoDiArray_2 = this.state.dataDict[csvName2];

            for (var i = 0; i < twoDiArray_1.length; ++i) {
                for (var j = 0; j < twoDiArray_1[i].length; ++j) {
                    twoDiArray_1[i][j] = '\"' + twoDiArray_1[i][j] + '\"';  // Handle elements that contain commas
                }
                csvRows.push(twoDiArray_1[i].join(','));
            }
            for (var i = 0; i < twoDiArray_2.length; ++i) {
                for (var j = 0; j < twoDiArray_2[i].length; ++j) {
                    twoDiArray_2[i][j] = '\"' + twoDiArray_2[i][j] + '\"';  // Handle elements that contain commas
                }
                csvRows.push(twoDiArray_2[i].join(','));
            }
    
            var csvString = csvRows.join('\r\n');
            var a         = document.createElement('a');
            a.href        = 'data:attachment/csv,' + csvString;
            a.target      = '_blank';
            a.download    = 'myFile.csv';  
            document.body.appendChild(a);
            a.click(); 
        } catch (e) {
            alert("Unable to download csv file. Try again.");
        }
    }


}
export default DataDashboardCompareTenant;