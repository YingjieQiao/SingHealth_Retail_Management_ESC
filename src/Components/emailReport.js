import React, { Component } from 'react';
import axios from "axios";
import Navbar from './Navbar';


class EmailReport extends Component {

    state = { 
        tenantArrary: [],
        timeframeArray: [],
        reportAvailable: false,
        emailContent: {
            email: "",
            report: "",
            body: "",
            subject: "",
        },
        hasSubmitForm: false
    }

    componentDidMount() {
        try {
            axios.get("http://localhost:5000/tenant_list")
            .then(
                res => {
                    console.log(res);
                    for (var i = 0; i < res.data.tenant_list.length; i++) {
                        let newArray1 = this.state.tenantArrary;
                        newArray1.push(res.data.tenant_list[i]["email"]);
                        this.setState({tenantArrary: newArray1});
                    }
                }
            );
        } catch (e) {

        }

    }

    render() {

        return (
            <div>
                <Navbar />
                <h2>Send Report</h2>
                <div>
                    <label>Email:</label>
                    <select class="custom-select my-1 mr-sm-2" onChange={this.saveReceiverEmail}>
                            <option selected>Choose...</option>
                            { this.state.tenantArrary.map(email => <option value={email}>{email}</option> ) }
                    </select>
                </div> 
                <div>
                    <label>Select a report to send:</label>
                    <select class="custom-select my-1 mr-sm-2" onChange={this.saveReportChoice}>
                            <option selected>Choose...</option>
                            { this.state.timeframeArray.map(report => <option value={report}>{report}</option> ) }
                    </select>
                </div> 
                <div>
                    <label>Subject:</label>
                    <input placeholder="Subject" onInput={this.saveReceiverSubject} type="text" />
                </div>
                <div>
                    <label>Note to receiver:</label>
                    <input placeholder="Write something to receiver" onInput={this.saveReceiverNote} type="text" />
                </div>
                <button type="submit" onClick={this.handleSendReport}>Send Email</button>
            </div>
        )
    }

    saveReceiverEmail = event => {
        const data = event.target.value;
        var newEmailContent = this.state.emailContent;
        if (data === "Choose...") {
            newEmailContent["email"] = "";
            this.setState({emailContent: newEmailContent});
        } else {
            newEmailContent["email"] = data;
            this.setState({emailContent: newEmailContent});
            try {
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                };
                axios.post("http://localhost:5000/report_timeframe", this.state.emailContent, headers)
                .then(
                    res => {
                        console.log(res);
                        if (res.data.status) {
                            this.setState({timeframeArray: res.data.timeframe_list});
                        }
                    }
                );
            } catch (e) {
                console.log(e);
            }
        }
    }

    saveReportChoice = event => {
        const data = event.target.value;
        var newEmailContent = this.state.emailContent;
        if (data === "Choose...") {
            newEmailContent["report"] = "";
            this.setState({emailContent: newEmailContent});
        } else {
            newEmailContent["report"] = data;
            this.setState({emailContent: newEmailContent});
        }
    }

    saveReceiverSubject = event => {
        var newEmailContent  = this.state.emailContent;
        newEmailContent["subject"] = event.target.value;
        this.setState({emailContent: newEmailContent});
    }

    saveReceiverNote = event => {
        var newEmailContent  = this.state.emailContent;
        newEmailContent["body"] = event.target.value;
        this.setState({emailContent: newEmailContent});
    }

    handleSendReport = event => {
        console.log(this.state.emailContent);
        // try {
        //     axios.post("http://localhost:5000/report_checklist", timestamp, headers)
        //         .then(
        //             res => {
        //                 console.log(res);
        //             }
        //         );
        // } catch (e) {
        //     console.log(e);
            
        // }
    }
    

}

export default EmailReport;