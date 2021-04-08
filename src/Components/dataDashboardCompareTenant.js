import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import styles from './CSS/dataDashboard.module.css';


class DataDashboardCompareTenant extends Component {

    state = {
        institute1: this.props.location.state.compareTenantList["institute1"],
        institute2: this.props.location.state.compareTenantList["institute2"],
        instituteName1: this.props.location.state.compareTenantList["instituteName1"],
        instituteName2: this.props.location.state.compareTenantList["instituteName2"],
        dataDict: null,
        timeChoice: "default",
        sendReport: false,
        emailContent: {
            tenant: "",
            email: "",
            body: "",
            subject: "",
        },
    }


    componentDidMount() {
        const data = {
            institute1: this.state.institute1,
            institute2: this.state.institute2,
        };
        axios.post("http://localhost:5000/compare_tenant", data)
        .then(
            res => {
                console.log(res);
                this.setState({dataDict: res.data})
            }
        )
    }

    render() {

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <div>
                    <label>Select a statistic to be displayed:</label>
                    <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.saveSelection}>
                        <option selected value="default">Choose...</option>
                        <option value="year">Yearly</option>
                        <option value="month">Monthly</option>
                        <option value="week">Weekly</option>
                        <option value="day">7 days</option>
                    </select>
                </div>
                <h3>{this.state.instituteName1}'s Performance Score</h3>
                <h3>{this.state.instituteName2}'s Performance Score</h3>
                <div>{this.displayImage()}</div>
                <div className={styles.button_container}>{this.displayExportButton()}</div>
                <div className={styles.button_container}>{this.displayReportButton()}</div>
                {/* <div className={styles.button_container}>{this.displayPopup()}</div> */}
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
                <div>
                    <h3>{this.displayImageHeading(index)}</h3>
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
                return "Yearly statistics";
            case "month":
                return "Monthly statistics";
            case "week":
                return "Weekly statistics";
            case "day":
                return "7 Days statistics";
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
                return <button type="button" className="btn btn-secondary" disabled>Export Graph to excel</button> ;
            }
        } else {
            return <button type="button" className="btn btn-secondary" disabled>Export Graph to excel</button> ;
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

    displayReportButton = () => {
        if (this.state.timeChoice !== "default") {
            const imageName = "audit_" + this.state.timeChoice + "_img";
            const validateImage = this.checkIfImageExist(imageName);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return <button type="button" className="btn btn-info" id={index} onClick={this.handleSendReport}>Send report</button>;
            }
            else {
                return <button type="button" className="btn btn-secondary" disabled>Send report</button> ;
            }
        } else {
            return <button type="button" className="btn btn-secondary" disabled>Send report</button> ;
        }
    }

    handleSendReport = event => {
        try {
            const emailAddress_1 = this.state.institute1;
            const emailAddress_2 = this.state.institute2;

            // axios.post here
        } catch (e) {
            console.log(e);
            
        }
    }

    // displayPopup = () => {
    //     if (this.state.sendReport === true) {
    //         return(
    //             <div>
    //                 <h4>Send report</h4>
    //                 <div>
    //                     <label>Email:</label>
    //                     <input placeholder="Email address" onInput={this.saveReceiverEmail} type="email" />
    //                 </div> 
    //                 <div>
    //                     <label>Subject:</label>
    //                     <input placeholder="Subject" onInput={this.saveReceiverSubject} type="text" />
    //                 </div>
    //                 <div>
    //                     <label>Note to receiver:</label>
    //                     <input placeholder="Write something to receiver" onInput={this.saveReceiverNote} type="text" />
    //                 </div>
    //                 <button type="submit" onClick={this.handleSendReport}>Send Email</button>
    //             </div>
    //         )
    //     }
    // }


    
    // saveReceiverEmail = event => {
    //     var newEmailContent  = this.state.emailContent;
    //     newEmailContent["email"] = event.target.value;
    //     this.setState({emailContent: newEmailContent});
    // }

    // saveReceiverSubject = event => {
    //     var newEmailContent  = this.state.emailContent;
    //     newEmailContent["subject"] = event.target.value;
    //     this.setState({emailContent: newEmailContent});
    // }

    // saveReceiverNote = event => {
    //     var newEmailContent  = this.state.emailContent;
    //     newEmailContent["note"] = event.target.value;
    //     this.setState({emailContent: newEmailContent});
    // }

}

export default DataDashboardCompareTenant;