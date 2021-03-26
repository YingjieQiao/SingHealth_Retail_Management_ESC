import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';


class DataDashboardTenant extends Component {

    state = {
        tenant: this.props.location.state.tenant,
        graph: null,
        imageDict: {
            day: "",
            week: "",
            month: "",
            year: ""
        },
        numOfImage: [],
        imageArray: []
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
                {/* <div class="btn-group" role="group" aria-label="Performance Score Trend Variation">
                    <button type="button" class="btn btn-outline-primary" value="yearly" onClick={this.handleGetTrend}>Yearly</button>
                    <button type="button" class="btn btn-outline-primary" value="monthly" onClick={this.handleGetTrend}>Monthly</button>
                    <button type="button" class="btn btn-outline-primary" value="weekly" onClick={this.handleGetTrend}>Weekly</button>
                    <button type="button" class="btn btn-outline-primary" value="7days" onClick={this.handleGetTrend}>7 days</button>
                </div> */}
                <div>
                    {this.state.numOfImage.map(image => {
                        return(
                            <div>
                                <h4>{this.displayImageHeading(image)}</h4>
                                <img src={this.state.imageArray[image]} alt={image} key={image} width="500" height="500" /> 
                            </div>
                        )
                    })}
                </div>
                <div>
                    <button type="button" class={this.getButtonClasses()} onClick={this.handleExport}>Export Graph to excel</button>
                </div>
            </div>
        )
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


    handleGetTrend = event => {
        switch(event.target.value) {
            case "yearly":
                break;
            case "monthly":
                // TODO: get 'monthly' graph 
                break;
            case "weekly":
                // TODO: get 'weekly' graph
                break;
            case "7days":
                // TODO: get '7days' graph
                break;
            default:
                // TODO: get 'yearly' graph 
        }
    }

    handleExport = event => {
        // TODO: export graph to excel format
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.state.graph === null ? 'secondary' : 'primary';
        return classes;
    }
}

export default DataDashboardTenant;