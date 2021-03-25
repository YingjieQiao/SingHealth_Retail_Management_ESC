import React, { Component } from 'react';
import axios from "axios";


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
        comment: ""
    }

    

    render() {

        return (
            <div>
                <h2>New Audit</h2>
                <h2>Audit Checklist (Non-F&#38;B)</h2>
                <form>
                    <label>Auditee:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditeeName" onChange={this.handleAuditee}>
                        <option selected value="-1">Choose...</option>
                        <option value="KFC">KFC</option>
                        <option value="McD">McD</option>
                        <option value="MosB">MosB</option>
                    </select>
                    <label>Auditor:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                        <option selected value="-1">Choose...</option>
                        <option value="Tom">Tom</option>
                        <option value="Jerry">Jerry</option>
                        <option value="Charlie">Charlie</option>
                    </select>
                    <label>Auditor's Department:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditorDepartment" onChange={this.handleDepartment}>
                        <option selected value="-1">Choose...</option>
                        <option value="CSR">CSR</option>
                        <option value="HR">HR</option>
                        <option value="Risk">Risk</option>
                    </select>

                    <h3>1. Professionalism &#38; Staff Hygiene (10%)</h3>
                    <h4>Professionalism</h4>
                    <div class="form-group">
                        <label>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|10)$' id="001" onInput={this.saveScore}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (40%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Adequate and regular pest control. Pest control record.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|10)$' id="007" onInput={this.saveScore}/>
                    </div>

                    <h3>Workplace Safety &#38; Health (40%)</h3>
                    <h4>General Safety</h4>
                    <div class="form-group">
                        <label>MSDS for all industrial chemicals are available and up to date.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|10)$' id="019" onInput={this.saveScore}/>
                    </div>

                    <button type="button" onClick={this.tabulateScore}>Tabulate scores</button>

                    <h4>Scoring</h4>
                    <p>Professionalism &#38; Staff Hygiene: {this.state.profStaffHydScore} /20%</p>
                    <p>Housekeeping &#38; General Cleanliness: {this.state.houseGeneralScore} /40%</p>
                    <p>Workplace Safety &#38; Health: {this.state.workSafetyHealthScore} /40%</p>
                    <p>Total Score: {this.state.totoalScore} /100%</p>
                    <label>Comments:</label>
                    <input onInput={this.saveComment} type="text" />
                </form>
                <button type="submit" onClick={this.handleSubmit}>Submit</button>

            </div>
        )
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

    handleAuditee = event => {
        var newScoreDict = this.state.scoreDict;
        var newFinalDict = this.state.finalDict;
        if (event.target.value !== -1) {
            newScoreDict["auditeeName"] = event.target.value;
            newFinalDict["auditeeName"] = event.target.value;
            this.setState({auditeeName: event.target.value, scoreDict: newScoreDict, finalDict: newFinalDict});
        } else {
            newScoreDict["auditeeName"] = "";
            newFinalDict["auditeeName"] = "";
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
        newScoreDict[event.target.id] = event.target.value;
        this.setState({scoreDict: newScoreDict});

        console.log(this.state.scoreDict);
    }

    saveComment = event => {
        var newFinalDict = this.state.finalDict;
        newFinalDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }

    handleSubmit = event  => {
        event.preventDefault();
        console.log("final: ", this.state.finalDict);

        console.log("length: ", Object.keys(this.state.finalDict).length);

        if (Object.keys(this.state.finalDict).length < this.state.dataLength ) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            
            const data = new FormData();
            console.log(data);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            };
            console.log(this.state.finalDict);
            data.append("auditChecklist", this.state.finalDict);
            console.log(data);
            
            axios.post("http://localhost:5000/auditChecklist", this.state.finalDict, headers
            ).then( res => {
                // console.log(data);
                console.log(res.statusText);
            });
        }
    }

    tabulateScore = event => {
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

            console.log("newSectionScore: ", this.state.sectionScore);

        }
    }

    

}

export default AuditChecklistTest;