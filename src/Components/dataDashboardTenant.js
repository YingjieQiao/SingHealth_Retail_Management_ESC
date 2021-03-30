import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';


class DataDashboardTenant extends Component {

    state = {
        tenant: this.props.location.state.tenant,
        tenantName: this.props.location.state.tenantName,
        graphDict: {
            day: false,
            week: false,
            month: false,
            year: false
        },
        imageDict: {
            day: "",
            week: "",
            month: "",
            year: ""
        },
        numOfImage: [],
        csvDict: {
            day: [],
            week: [],
            month: [],
            year: []
        },
        timeChoice: "default"
    }


    componentDidMount() {
        const data = {
            tenant: this.state.tenant
        };

        console.log("name: ", this.state.tenant);

        axios.post("http://localhost:5000/tenant_exists", data)
        .then(
            res => {
                console.log(res.data);

                let counter = 0;
                for (var key in res.data) {
                    switch (key) {
                        case "audit_day_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_day_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["day"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_week_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_week_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["week"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_month_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_month_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["month"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_year_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_year_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["year"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_day_csv":
                            var newCsvDict = this.state.csvDict;
                            newCsvDict["day"] = res.data["audit_day_csv"];
                            this.setState({csvDict: newCsvDict});

                            var newGraphDict = this.state.graphDict;
                            newGraphDict["day"] = true;
                            this.setState({graphDict: newGraphDict});
                            break;
                        case "audit_week_csv":
                            var newCsvDict = this.state.csvDict;
                            newCsvDict["week"] = res.data["audit_week_csv"];
                            this.setState({csvDict: newCsvDict});

                            var newGraphDict = this.state.graphDict;
                            newGraphDict["week"] = true;
                            this.setState({graphDict: newGraphDict});
                            break;
                        case "audit_month_csv":
                            var newCsvDict = this.state.csvDict;
                            newCsvDict["month"] = res.data["audit_month_csv"];
                            this.setState({csvDict: newCsvDict});

                            var newGraphDict = this.state.graphDict;
                            newGraphDict["month"] = true;
                            this.setState({graphDict: newGraphDict});

                            break;
                        case "audit_year_csv":
                            var newCsvDict = this.state.csvDict;
                            newCsvDict["year"] = res.data["audit_year_csv"];
                            this.setState({csvDict: newCsvDict});

                            var newGraphDict = this.state.graphDict;
                            newGraphDict["year"] = true;
                            this.setState({graphDict: newGraphDict});
                            break;
                        default:
                            break;
                    }

                };

            }
        );
        
    }

    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>{this.state.tenant}'s Performance Score</h3>
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
            const validateImage = this.checkIfImageExist(this.state.timeChoice);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return (
                <div>
                    <h3>{this.displayImageHeading(index)}</h3>
                    <img src={this.getImageSrc(index)} alt={index} key={index} width="500" height="500" />  
                </div> );
            }
            else {
                return <p style={{fontStyle: 'italic'}} className="text-primary">No available statistics is found.</p>;
            }
        } else {
            return <p style={{fontStyle: 'italic'}} className="text-info">Please choose a statistic to be displayed.</p>;
        }
    }

    getImageSrc = (index) => {
        switch (index) {
            case "year":
                return this.state.imageDict["year"];
            case "month":
                return this.state.imageDict["month"];
            case "week":
                return this.state.imageDict["week"];
            case "day":
                return this.state.imageDict["day"];
            default:
                return "";
        }  
    }

    displayExportButton = () => {
        if (this.state.timeChoice !== "default") {
            const validateImage = this.checkIfImageExist(this.state.timeChoice);
            const index = this.state.timeChoice;
            if (validateImage === true) {
                return <button type="button" class={this.getButtonClasses(this.handleExportButtonId(index))} id={this.handleExportButtonId(index)} onClick={this.handleExport}>Export {this.displayButtonLabel(index)} Graph to excel</button>;
            }
            else {
                return <button type="button" className="btn btn-lg btn-secondary" disabled>Export Graph to excel</button> ;
            }
        } else {
            return <button type="button" className="btn btn-lg btn-secondary" disabled>Export Graph to excel</button> ;
        }
    }

    checkIfImageExist = (data) => {
        const val = this.state.imageDict[data];
        if (val === null || val === undefined){
            return false;
        }
        else if (val !== ""){
            return true;
        } else {
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

    handleExportButtonId = (index) => {
        switch (index) {
            case 0:
                return "year";
            case 1:
                return "month";
            case 2:
                return "week";
            case 3:
                return "day";
            default:
                break;
        }
    }

    handleExport = (event) => {
        var csvRows = [];
        switch(event.target.id) {
            case "year":
                var twoDiArray = this.state.csvDict["year"];
                break;
            case "month":
                var twoDiArray = this.state.csvDict["month"];
                break;
            case "week":
                var twoDiArray = this.state.csvDict["week"];
                break;
            case "day":
                var twoDiArray = this.state.csvDict["day"];
                break;
            default:
                alert("There is no csv file to download.");
                break;
        }

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
        console.log(csvString);

    }

    validateCsvAvailability = (data) => {
        if (this.state.graphDict[data] === false) {
            return false;
        } else {
            return true;
        }
    }

    getButtonClasses(data) {
        let classes = 'btn btn-';
        classes += this.validateCsvAvailability(data) === false ? 'secondary' : 'primary';
        // classes += this.state.graph === null ? 'secondary' : 'primary';
        return classes;
    }
}

export default DataDashboardTenant;