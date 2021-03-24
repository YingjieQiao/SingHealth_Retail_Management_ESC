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
        score: {},
        scoreDict: {},
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
                        <option>KFC</option>
                        <option>McD</option>
                        <option>MosB</option>
                    </select>

                    <label>Auditor:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                        <option selected value="-1">Choose...</option>
                        <option>Tom</option>
                        <option>Jerry</option>
                        <option>Charlie</option>
                    </select>
                    <label>Auditor's Department:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditorDepartment" onChange={this.handleDepartment}>
                        <option selected value="-1">Choose...</option>
                        <option>CSR</option>
                        <option>HR</option>
                        <option>Risk</option>
                    </select>

                    <h3>1. Professionalism &#38; Staff Hygiene (10%)</h3>
                    <h4>Professionalism</h4>
                    <div class="form-group">
                        <label>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|10)$' id="profScore" onInput={this.handler1}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (40%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Adequate and regular pest control. Pest control record.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="housekeepingScore" onInput={this.handler1}/>
                    </div>

                    <h3>Workplace Safety &#38; Health (40%)</h3>
                    <h4>General Safety</h4>
                    <div class="form-group">
                        <label>MSDS for all industrial chemicals are available and up to date.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="workSafetyScore" onInput={this.handler1}/>
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
        if (event.target.value !== -1) {
            newScoreDict["auditorName"] = event.target.value;
            this.setState({auditorName: event.target.value, scoreDict: newScoreDict});
        } else {
            newScoreDict["auditorName"] = "";
            this.setState({scoreDict: newScoreDict});
        }
    }

    handleAuditee = event => {
        var newScoreDict = this.state.scoreDict;
        if (event.target.value !== -1) {
            newScoreDict["auditeeName"] = event.target.value;
            this.setState({auditeeName: event.target.value, scoreDict: newScoreDict});
        } else {
            newScoreDict["auditeeName"] = "";
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

    handler1 = event => {
        var newScoreDict = this.state.scoreDict;
        newScoreDict[event.target.id] = event.target.value;
        this.setState({scoreDict: newScoreDict});

        console.log(this.state.scoreDict);
    }

    saveComment = event => {
        var newScoreDict = this.state.scoreDict;
        newScoreDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }

    handleSubmit = event  => {
        event.preventDefault();
        console.log("final: ", this.state.scoreDict);

        if (Object.keys(this.state.scoreDict).length < this.state.dataLength || this.state.auditeeName.length === 0 || this.state.auditorName.length === 0 || this.state.auditorDepartment.length === 0) {
            console.log("empty field");
            alert("Please fill up all fields");
            console.log(Object.keys(this.state.scoreDict).length < this.state.dataLength, this.state.auditeeName.length === 0,  this.state.auditorName.length === 0,  this.state.auditorDepartment.length === 0);
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            const data = new FormData();
            console.log(data);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            };
            console.log(this.state.scoreDict);
            data.append("auditChecklist", this.state.scoreDict);
            console.log(data);
            
            axios.post("http://localhost:5000/auditChecklist", this.state.scoreDict, headers
            ).then( res => {
                // console.log(data);
                console.log(res.statusText);
            })
        }
    }

    tabulateScore = event => {
        if (Object.keys(this.state.scoreDict).length !== this.state.dataLength) {
            console.log("empty field");
        } else {
            // all data has been filled
            let profStaffHydScore = 0;
            let houseGeneralScore = 0;
            let workSafetyHealthScore = 0;

            for (let k in this.state.scoreDict) {
                if (k <= 6) {
                    profStaffHydScore += parseInt(this.state.scoreDict[k]);
                } else if ( k >= 7 &&  k <= 18) {
                    houseGeneralScore += parseInt(this.state.scoreDict[k]);
                } else if (k >= 19 ) {
                    workSafetyHealthScore += parseInt(this.state.scoreDict[k]);
                }
            }
            // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
            profStaffHydScore = (profStaffHydScore / 10) * 20;
            houseGeneralScore = (houseGeneralScore / 10) * 40;
            workSafetyHealthScore = (workSafetyHealthScore / 10) * 40;

            let total = profStaffHydScore + houseGeneralScore + workSafetyHealthScore;

            this.setState({
                profStaffHydScore: profStaffHydScore,
                houseGeneralScore: houseGeneralScore,
                workSafetyHealthScore: workSafetyHealthScore,
                totoalScore: total
            });

        }
    }

    

}

export default AuditChecklistTest;