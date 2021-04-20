import React, { Component } from 'react';
import axios from "axios";
import styles from "./CSS/auditForm.module.css";


class AuditChecklistTest extends Component {

    state = { 
        dataLength: 7,
        auditorName: "",
        auditorDepartment: "",
        auditeeName: "",
        profStaffHydScore: 0,
        houseGeneralScore: 0,
        workSafetyHealthScore: 0,
        totoalScore: 0,
        scoreDict: {},
        finalDict: {
            comment: ""
        },
        comment: "",
        auditeeArray: [],
        numOfAuditee: [],
        options: [0,1,2,3,4,5,6,7,8,9,10],
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
                        <label className={styles.form_qn}>Audit Checklist (Test)</label>
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
                        <label className={styles.heading}>Part 1: Professionalism &#38; Staff Hygiene (10%)</label>
                        <label className={styles.form_qn}>Professionalism</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="001" id="001" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>

                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 2: Housekeeping &#38; General Cleanliness (40%)</label>
                        <label className={styles.form_qn}>General Environment Cleanliness</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Adequate and regular pest control. Pest control record.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="007" id="007" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>
                    )})}
                    <label>Highest score</label></div>            
                    </div>

                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 3: Workplace Safety &#38; Health (40%)</label>
                        <label className={styles.form_qn}>General Safety</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>MSDS for all industrial chemicals are available and up to date.</label>
                        <div>
                        <label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="019" id="019" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>
                    )})}
                        <label>Highest score</label>
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
        var newFinalDict = this.state.finalDict;
        if (data === "Choose...") {
            newScoreDict["auditeeName"] = "";
            newFinalDict["auditeeName"] = "";
            this.setState({auditeeName: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            const index = parseInt(data);
            newScoreDict["auditeeName"] = this.state.auditeeArray[index]["email"];
            newFinalDict["auditeeName"] = this.state.auditeeArray[index]["email"];
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
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
        var newFinalDict = this.state.finalDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorName"] = event.target.value;
            newFinalDict["auditorName"] = event.target.value;
            this.setState({auditorName: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            newScoreDict["auditorName"] = "";
            newFinalDict["auditorName"] = "";
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
        }
    }

    handleDepartment = event => {
        var newScoreDict = this.state.scoreDict;
        var newFinalDict = this.state.finalDict;
        if (event.target.value !== -1) {
            newScoreDict["auditorDepartment"] = event.target.value;
            newFinalDict["auditorDepartment"] = event.target.value;
            this.setState({auditorDepartment: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            newScoreDict["auditorDepartment"] = "";
            newFinalDict["auditorDepartment"] = "";
            this.setState({scoreDict: newScoreDict, finalDict: newFinalDict});
        }
    }

    saveScore = event => {
        var newScoreDict = this.state.scoreDict;
        const val = parseInt(event.target.value);
        if (val >= 0) {
            newScoreDict[event.target.id] = val;
        } else {
            newScoreDict[event.target.id] = 0;
        }
        this.setState({scoreDict: newScoreDict});
    }

    saveComment = event => {
        var newFinalDict = this.state.finalDict;
        newFinalDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }


    tabulateScore = () => {
        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
        } else {
            // all data has been filled
            let profStaffHydScore = 0;
            let houseGeneralScore = 0;
            let workSafetyHealthScore = 0;
            let newFinalDict = this.state.finalDict;

            for (let k in this.state.scoreDict) {
                let data = this.state.scoreDict[k];
                if (Number.isInteger(parseInt(data))) {
                    if (k <= 6) {
                        profStaffHydScore += parseInt(data);
                    } else if ( k >= 7 &&  k <= 18) {
                        houseGeneralScore += parseInt(data);
                    } else if (k >= 19 ) {
                        workSafetyHealthScore += parseInt(data);
                    }
                } else {
                    continue;
                }
            }

            // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
            profStaffHydScore = (profStaffHydScore / 10) * 20;
            houseGeneralScore = (houseGeneralScore / 10) * 40;
            workSafetyHealthScore = (workSafetyHealthScore / 10) * 40;

            newFinalDict["profStaffHydScore"] = profStaffHydScore;
            newFinalDict["houseGeneralScore"] = houseGeneralScore;
            newFinalDict["workSafetyHealthScore"] = workSafetyHealthScore;


            let total = profStaffHydScore + houseGeneralScore + workSafetyHealthScore;

            this.setState({
                profStaffHydScore: profStaffHydScore,
                houseGeneralScore: houseGeneralScore,
                workSafetyHealthScore: workSafetyHealthScore,
                totoalScore: total,
                finalDict: newFinalDict
            });

        }
    }

    individualScore = () => {
        var individualScoreDict = {
            profStaffHydScore: [],
            houseGeneralScore: [],
            workSafetyHealthScore: []
        };

        for (let k in this.state.scoreDict) {
            let data = this.state.scoreDict[k];
            if (Number.isInteger(parseInt(data))) {
                if (k <= 6) {
                    individualScoreDict["profStaffHydScore"].push(parseInt(data));
                } else if ( k >= 7 &&  k <= 18) {
                    individualScoreDict["houseGeneralScore"].push(parseInt(data));
                } else if ( k >= 19 ) {
                    individualScoreDict["workSafetyHealthScore"].push(parseInt(data));
                } 
            } else {
                continue;
            }
        }
        console.log("score: ", individualScoreDict);
        return individualScoreDict;
    }

    handleSubmitForm = event  => {
        event.preventDefault();

        try {
            if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
                alert("Please fill up all fields.");
            } else { 
                // all data has been filled
                // proceeds to send data to backend
                this.tabulateScore();
                const individualScore = this.individualScore();

                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*',
                    withCredentials: true
                };

                axios.post("http://localhost:5000/auditChecklist", this.state.finalDict, headers
                ).then( res => {
                    console.log(res.statusText);
                    this.setState({hasSubmitForm: true});
                    alert("The form has been successfully recorded.");
                });                

            }
        } catch (e) {
            console.log(e);
            alert("Unsuccessful. Please try again.");
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
        if (Object.keys(this.state.finalDict).length === 1 ) {
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

export default AuditChecklistTest;