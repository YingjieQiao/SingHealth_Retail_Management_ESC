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
        imageArray: [],
        csvDict: {
            day: [],
            week: [],
            month: [],
            year: []
        }
    }


    componentDidMount() {
        const data = {
            tenant: this.state.tenant
        };

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

                            var newImageArray = this.state.imageArray;
                            newImageArray.push(imgsrc);
                            this.setState({imageArray: newImageArray});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_week_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_week_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["week"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newImageArray = this.state.imageArray;
                            newImageArray.push(imgsrc);
                            this.setState({imageArray: newImageArray});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_month_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_month_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["month"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newImageArray = this.state.imageArray;
                            newImageArray.push(imgsrc);
                            this.setState({imageArray: newImageArray});

                            var newNumOfImage = this.state.numOfImage;
                            newNumOfImage.push(counter++);
                            this.setState({numOfImage: newNumOfImage});
                            break;
                        case "audit_year_img":
                            var imgsrc = "data:image/png;base64," + res.data["audit_year_img"];
                            var newImageDict = this.state.imageDict;
                            newImageDict["year"] = imgsrc;
                            this.setState({imageDict: newImageDict});

                            var newImageArray = this.state.imageArray;
                            newImageArray.push(imgsrc);
                            this.setState({imageArray: newImageArray});

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
                <h3>{this.state.tenantName}'s Performance Score</h3>
                <div>
                    {this.state.numOfImage.map(image => {
                        return(
                            <div>
                                <h4>{this.displayImageHeading(image)}</h4>
                                <img src={this.getImageSrc(image)} alt={image} key={image} width="500" height="500" /> 
                                {/* <img src={this.state.imageArray[image]} alt={image} key={image} width="500" height="500" />  */}
                                <div>
                                    <button type="button" class={this.getButtonClasses(this.handleExportButtonId(image))} id={this.handleExportButtonId(image)} onClick={this.handleExport}>Export {this.displayButtonLabel(image)} Graph to excel</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    getImageSrc = (index) => {
        switch (index) {
            case 0:
                return this.state.imageDict["year"];
            case 1:
                return this.state.imageDict["month"];
            case 2:
                return this.state.imageDict["week"];
            case 3:
                return this.state.imageDict["day"];
            default:
                return "";
        }  
    }

    displayImageHeading = (index) => {
        switch (index) {
            case 0:
                return "Yearly statistics";
            case 1:
                return "Monthly statistics";
            case 2:
                return "Weekly statistics";
            case 3:
                return "7 Days statistics";
            default:
                return "No statistics available";
        }
    }

    displayButtonLabel = (index) => {
        switch (index) {
            case 0:
                return "Yearly";
            case 1:
                return "Monthly";
            case 2:
                return "Weekly";
            case 3:
                return "7 Days";
            default:
                return alert("This should not happen!");
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
                return alert("This should not happen!");
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