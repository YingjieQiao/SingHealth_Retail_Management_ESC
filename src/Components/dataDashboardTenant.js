import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';


class DataDashboardTenant extends Component {

    state = {
        tenant: this.props.location.state.tenant["email"],
        tenantName: this.props.location.state.tenant["name"],
        timeChoice: "default",
        dataDict: null
    }


    componentDidMount() {
        const data = {
            tenant: this.state.tenant
        };

        axios.post("http://localhost:5000/dashboard_data", data)
        .then(
            res => {
                console.log(res);
                this.setState({dataDict: res.data});
                // console.log(typeof this.state.dataDict.audit_day_img);
                // console.log(this.state.dataDict["audit_day_img"]);
            }
        );
        
    }

    render() {

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>{this.state.tenantName}'s Performance Score</h3>
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
                <div>{this.displayImage()}</div>
                <div>{this.displayExportButton()}</div>
                <div>{this.displayReportButton()}</div>
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

    displayReportButton = () => {
        if (this.state.timeChoice !== "default") {
            const imageName = "audit_" + this.state.timeChoice + "_img";
            const validateImage = this.checkIfImageExist(imageName);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return <button type="button" className="btn btn-info" id={index} onClick={this.handleSend}>Send report</button>;
            }
            else {
                return <button type="button" className="btn btn-secondary" disabled>Send report</button> ;
            }
        } else {
            return <button type="button" className="btn btn-secondary" disabled>Send report</button> ;
        }
    }

    handleSend = () => {
        // send report
    }

}

export default DataDashboardTenant;