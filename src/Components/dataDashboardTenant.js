import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import styles from './CSS/dataDashboard.module.css';
import mainStyle from './CSS/home.module.css';
import uploadStyle from './CSS/upload.module.css';

class DataDashboardTenant extends Component {

    state = {
        tenant: this.props.location.state.tenant["email"],
        tenantName: this.props.location.state.tenant["name"],
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
                    if(res.data.username==="" || res.data.username === "UnitTester"){
                        alert("Please Log in!");
                        this.props.history.push('/');
                    }
                }
            );

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                withCredentials: true
            };

            const data = {tenant: this.state.tenant};
            axios.post("http://localhost:5000/dashboard_data", data, headers)
            .then(
                res => {
                    if (res.data.result) {
                        console.log(res);
                        this.setState({dataDict: res.data});
                    }
                }
            );

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
                        <h1 className={mainStyle.header}>{this.state.tenantName}'s Performance Score</h1>
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
            const csvName = "audit_" + this.state.timeChoice + "_csv";
            var csvRows = [];
            var twoDiArray = this.state.dataDict[csvName];
    
            for (var i = 0; i < twoDiArray.length; ++i) {
                for (var j = 0; j < twoDiArray[i].length; ++j) {
                    twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';  // Handle elements that contain commas
                }
                csvRows.push(twoDiArray[i].join(','));
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

export default DataDashboardTenant;