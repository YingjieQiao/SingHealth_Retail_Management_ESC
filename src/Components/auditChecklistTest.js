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
        comment: "",
        auditeeArray: [],
        numOfAuditee: []
    }

    componentDidMount() {
        axios.get("http://localhost:5000/tenant_list")
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
        )
    }

    render() {

        return (
            <div>
                <h2>New Audit</h2>
                <h2>Audit Checklist (Non-F&#38;B)</h2>
                <form>
                    <div>
                        <label>Auditee:</label>
                        <select class="custom-select my-1 mr-sm-2" onChange={this.saveAuditee}>
                            <option selected>Choose...</option>
                            { this.state.numOfAuditee.map(index => <option value={index.toString()}>{this.handleAuditee(index)}</option> ) }
                        </select>
                    </div>
                    <div>
                        <label>Auditor:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorName" onChange={this.handleAuditor}>
                            <option selected value="-1">Choose...</option>
                            <option value="Tom">Tom</option>
                            <option value="Jerry">Jerry</option>
                            <option value="Charlie">Charlie</option>
                        </select>
                    </div>
                    <div>
                        <label>Auditor's Department:</label>
                        <select class="custom-select my-1 mr-sm-2" id="auditorDepartment" onChange={this.handleDepartment}>
                            <option selected value="-1">Choose...</option>
                            <option value="CSR">CSR</option>
                            <option value="HR">HR</option>
                            <option value="Risk">Risk</option>
                        </select>
                    </div>

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

                    <button type="button" class={this.getButtonClasses()} onClick={this.tabulateScore}>Tabulate scores</button>

                    <h4>Scoring</h4>
                    <p>Professionalism &#38; Staff Hygiene: {this.state.profStaffHydScore} /20%</p>
                    <p>Housekeeping &#38; General Cleanliness: {this.state.houseGeneralScore} /40%</p>
                    <p>Workplace Safety &#38; Health: {this.state.workSafetyHealthScore} /40%</p>
                    <p>Total Score: {this.state.totoalScore} /100%</p>
                    <label>Comments:</label>
                    <input onInput={this.saveComment} type="text" />
                </form>
                <button type="submit" class={this.getButtonClasses()} onClick={this.handleSubmit}>Submit</button>

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
        if (event.target.value >= 0) {
            newScoreDict[event.target.id] = event.target.value;
        } else {
            newScoreDict[event.target.id] = 0;
        }
        this.setState({scoreDict: newScoreDict});
        this.updateSectionScore(event.target.id, event.target.value);
    }

    updateSectionScore = (qnId, qnValue) => {
        let newProfStaffHydScore = this.state.profStaffHydScore;
        let newHouseGeneralScore = this.state.houseGeneralScore;
        let newWorkSafetyHealthScore = this.state.workSafetyHealthScore;
        let newFinalDict = this.state.finalDict;

        // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
        if (qnId <= 6) {
            newProfStaffHydScore += parseInt(qnValue);
            newProfStaffHydScore = (newProfStaffHydScore / 10) * 20;
            newFinalDict["profStaffHydScore"] = newProfStaffHydScore;

        }
        else if (qnId >= 7 &&  qnId <= 18) {
            newHouseGeneralScore += parseInt(qnValue);
            newHouseGeneralScore = (newHouseGeneralScore / 10) * 40;
            newFinalDict["houseGeneralScore"] = newHouseGeneralScore;
        }
        else if (qnId >= 19) {
            newWorkSafetyHealthScore += parseInt(qnValue);
            newWorkSafetyHealthScore = (newWorkSafetyHealthScore / 10) * 40;
            newFinalDict["workSafetyHealthScore"] = newWorkSafetyHealthScore;
        }

        let total = newProfStaffHydScore + newHouseGeneralScore + newHouseGeneralScore;

        this.setState({
            profStaffHydScore: newProfStaffHydScore,
            houseGeneralScore: newHouseGeneralScore,
            workSafetyHealthScore: newHouseGeneralScore,
            totoalScore: total,
            finalDict: newFinalDict
        });
    }

    saveComment = event => {
        var newFinalDict = this.state.finalDict;
        newFinalDict["comment"] = event.target.value;
        this.setState({comment: event.target.value});
    }

    handleSubmit = event  => {
        event.preventDefault();
        console.log("final: ", this.state.finalDict);

        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            };
            
            axios.post("http://localhost:5000/auditChecklist", this.state.finalDict, headers
            ).then( res => {
                console.log(res.statusText);
                alert("The form has been successfully recorded.");
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

        }
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