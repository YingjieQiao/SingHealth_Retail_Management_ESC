import React, { Component } from 'react';
import axios from "axios";
import Navbar from './Navbar';
import mainStyle from './CSS/home.module.css';
import uploadStyle from './CSS/upload.module.css';
import background from './logo/background.jpg';

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
            axios.get("http://localhost:5000/get_current_username_and_datetime",{withCredentials: true})
            .then(
                res => {
                    console.log(res.data);
                    if(res.data.username===""||res.data.username==="UnitTester"){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            )
            axios.get("http://localhost:5000/tenant_list", {withCredentials: true})
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
            <div className={uploadStyle.body}>
                <Navbar />
                <div style={{ 
                backgroundImage: `url(${background})`,  backgroundSize: "cover"
                                }}>
                 <div class="container21" >
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Send Report</h2>
                </div>
                <div className={uploadStyle.info_body}>
                    <label className={uploadStyle.info_label}>Email:</label>
                    <select class="custom-select my-1 mr-sm-2" onChange={this.saveReceiverEmail}>
                            <option selected>Choose...</option>
                            { this.state.tenantArrary.map(email => <option value={email}>{email}</option> ) }
                    </select><br />

                    <label className={uploadStyle.info_label}>Select a report to send:</label>
                    <select class="custom-select my-1 mr-sm-2" onChange={this.saveReportChoice}>
                            <option selected>Choose...</option>
                            { this.state.timeframeArray.map(report => <option value={report}>{report}</option> ) }
                    </select><br />

                    <label className={uploadStyle.info_label}>Subject:</label>
                    <input placeholder="Subject" onInput={this.saveReceiverSubject} type="text" /><br />

                    <label className={uploadStyle.info_label}>Note to receiver:</label>
                    <input placeholder="Write something to receiver" onInput={this.saveReceiverNote} type="text" /><br />

                    <div className={uploadStyle.button_container}>
                        <button type="submit" className="btn btn-primary m-2" onClick={this.handleSendReport}>Send Email</button>
                    </div>
                </div> 
            </div> </div> </div>
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
                    'Access-Control-Allow-Origin': '*',
                    withCredentials: true
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
        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                withCredentials: true
            };
            axios.post("http://localhost:5000/report_checklist", this.state.emailContent, headers)
                .then(
                    res => {
                        console.log(res);

                        alert("Email has been sent successfully.");
                    }
                );
        } catch (e) {
            console.log(e);
            alert("Not able to send an email. Please try again");
        }
    }
    

}

export default EmailReport;