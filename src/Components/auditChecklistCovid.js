import React, { Component } from 'react';
import axios from "axios";
import styles from "./CSS/auditForm.module.css";


class AuditChecklistCovid extends Component {

    // TODO: Add more auditors
    // TODO: Disable more than 1 selection in one question

    state = { 
        // 13 qn + 1 comment + 3 dropdown
        dataLength: 17,
        auditorName: "",
        auditorDepartment: "",
        auditeeName: "",
        scoreDict: {
            comment: ""
        },
        comment: "",
        auditeeArray: [],
        numOfAuditee: [],
        options: ["No", "Yes", "NA"],
        hasSubmitForm: false,
        auditorArray: [],
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
            axios.get("http://localhost:5000/tenant_list", {withCredentials: true})
            .then(
                res => {
                    console.log(res);
    
                    for (var i = 0; i < res.data.tenant_list.length; i++) {
                        let newArray1 = this.state.auditeeArray;
                        let newArray2 = this.state.numOfAuditee;
                        newArray1.push(res.data.tenant_list[i]);
                        newArray2.push(i);
                        this.setState({auditeeArray: newArray1, numOfAuditee: newArray2});
                    }
    
                }
            );
            axios.get("http://localhost:5000/staff_list", {withCredentials: true})
            .then(
                res => {
                    if (res.data.result) {
                        console.log(res);
                        for (var i = 0; i < res.data.tenant_list.length; i++) {
                            let newArray1 = this.state.auditorArray;
                            let name = res.data.tenant_list[i]["firstName"] + res.data.tenant_list[i]["lastName"];
                            newArray1.push(name);
                            this.setState({auditorArray: newArray1});
                        }
                    }
                }
            );
        } catch (e) { console.log(e); }
    }

    render() {

        return (
            <div>                
                <form className={styles.form}>
                    <div className={styles.qn_body}>
                        <label className={styles.title}>New Audit</label>
                        <label className={styles.form_qn}>Audit Checklist (Covid Safe Management Measures)</label>
                    </div>

                    <div className={styles.qn_body} >
                        <label className={styles.form_qn}>Auditee:</label>
                        <select className={styles.form_qn} class="custom-select my-1 mr-sm-2" onChange={this.saveAuditee}>
                            <option selected>Choose...</option>
                            { this.state.numOfAuditee.map(index => <option value={index.toString()}>{this.handleAuditee(index)}</option> ) }
                        </select>
                    </div>

                    <div className={styles.qn_body} >
                        <label className={styles.form_qn}>Auditor:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                            <option selected value="-1">Choose...</option>
                            { this.state.auditorArray.map(auditor => <option value={auditor}>{auditor}</option> ) }
                        </select>
                    </div>                   
                    {/* <div className={styles.qn_body} >
                        <label className={styles.form_qn}>Auditor:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                            <option selected value="-1">Choose...</option>
                            <option value="Tom">Tom</option>
                            <option value="Jerry">Jerry</option>
                            <option value="Charlie">Charlie</option>
                        </select>
                    </div> */}
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Auditor's Department:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorDepartment" onChange={this.handleDepartment}>
                            <option selected value="-1">Choose...</option>
                            <option value="CSR">CSR</option>
                            <option value="HR">HR</option>
                            <option value="Risk">Risk</option>
                        </select>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 1: Safe Management Measures for Front-of-house</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>SafeEntry has been implemented for dine-in customers.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="001" id="001" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Temperature screening is conducted for customers of outlets that are located outside of institution’s temperature screening zone.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="002" id="002" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Table and seating arrangement adheres to the one-metre spacing between tables or groups. Where tables/seats are fixed, tables/seats should be marked out, ensuring at least one-metre spacing.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="003" id="003" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Queue is demarcated to ensure at least one-metre spacing between customers such as entrances and cashier counters (e.g. through floor markers).</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="004" id="004" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff to ensure customers maintain safe distance of one-metre when queuing and seated.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="005" id="005" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff to ensure customers wear a mask at all times, unless eating or drinking.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="006" id="006" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Hand sanitizers are placed at high touch areas (i.e. tray return, collection point, outlet entrance/exit).</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="007" id="007" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Outlet promotes use of cashless payment modes.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="008" id="008" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 1: Staff Hygiene &#38; Safe Management Measures</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All staff to wear a mask at all times, unless eating or drinking.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="009" id="009" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Mask worn by staff is in the correct manner (i.e. cover nose and mouth, no hanging of mask under the chin/neck).</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="010" id="010" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All staff to record their temperature daily.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="011" id="011" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff to maintain safe distance of one-metre (where possible) and not congregate, including at common areas, and during break/meal times.</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="012" id="012" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Check with supervisor that all staff record SafeEntry check-in and check-out (Note: Supervisor is accountable for adherence).</label>
                        <div>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="013" id="013" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        </div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Comments:</label>
                        <input className={styles.commentInput} onInput={this.saveComment} type="text" />
                    </div>
                    <div className={styles.button_container}><button type="submit" class={this.getButtonClasses()} onClick={this.handleSubmitForm}>Submit</button></div>
                    <div className={styles.button_container}><button type="submit" class={this.getSendReportButtonClasses()} onClick={this.handleSendReport}>Send report</button></div>                
                </form>
            </div>
        )
    }

    saveAuditee = (event) => {
        const data = event.target.value;
        var newScoreDict = this.state.scoreDict;
        if (data === "Choose...") {
            newScoreDict["auditeeName"] = "";
            this.setState({auditeeName: event.target.value, scoreDict: newScoreDict});
        } else {
            const index = parseInt(data);
            newScoreDict["auditeeName"] = this.state.auditeeArray[index]["email"];
            this.setState({scoreDict: newScoreDict});
        }
    }

    handleAuditee = (index) => {
        if (this.state.auditeeArray.length === 0){
            return "-";
        } else {
            return this.state.auditeeArray[index]["firstName"] + " " + this.state.auditeeArray[index]["lastName"];
        }
    }

    handleAuditor = event => {
        var newScoreDict = this.state.scoreDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorName"] = event.target.value;
            this.setState({auditorName: event.target.value, scoreDict: newScoreDict});
        } else {
            newScoreDict["auditorName"] = "";
            this.setState({scoreDict: newScoreDict});
        }
    }

    handleDepartment = event => {
        var newScoreDict = this.state.scoreDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorDepartment"] = event.target.value;
            this.setState({auditorDepartment: event.target.value, scoreDict: newScoreDict});
        } else {
            newScoreDict["auditorDepartment"] = "";
            this.setState({scoreDict: newScoreDict});
        }
    }

    saveScore = event => {
        var newScoreDict = this.state.scoreDict;
        if (event.target.value === "No") {
            newScoreDict[event.target.id] = 0;
        } 
        else if (event.target.value === "Yes") {
            newScoreDict[event.target.id] = 1;
        }
        else {
            newScoreDict[event.target.id] = -1;
        }
        this.setState({scoreDict: newScoreDict});
    }

    saveComment = event => {
        var newScoreDict = this.state.scoreDict;
        newScoreDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }

    handleSubmitForm = event  => {
        event.preventDefault();
        console.log("final: ", this.state.scoreDict);

        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*', 
                withCredentials: true
            };
            
            axios.post("http://localhost:5000/covidChecklist", this.state.scoreDict, headers
            ).then( res => {
                console.log(res.statusText);
                alert("The form has been successfully recorded.");
            });
        }
    }

    handleSendReport = (event) => {
        event.preventDefault();
        try {
            if (this.state.hasSubmitForm === false) {
                alert("Please submit the form before sending the report.");
            } else { 

                // axios.post
                
            }
        } catch (e) {
            console.log(e);
            alert("Unsuccessful. Please try again.");
        }
    }

    validateReportSubmission() {
        if (this.state.hasSubmitForm === false) return false;
        else { return true; }
    }

    getSendReportButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateReportSubmission() === false ? 'secondary' : 'primary';
        return classes;
    }

    validateData = () => {
        if (Object.keys(this.state.scoreDict).length === 1 ) {
            return false;
        }
        else if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            return false;
        } else {
            return true;
        }
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateData() === false ? 'secondary' : 'primary';
        return classes;
    }

    

}

export default AuditChecklistCovid;