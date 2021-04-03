import React, { Component } from 'react';
import axios from "axios";

class AuditChecklistNonFB extends Component {

    // TODO: Add more auditors

    state = { 
        // 34 qn + 1 comment + 3 dropdown
        dataLength: 38,
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
        axios.get("http://localhost:5000/tenant_list_non_FB")
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
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="001" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Staff Attendance: adequate staff for peak and non-peak hours.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="002" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="003" onInput={this.saveScore}/>
                    </div>


                    <h4>Staff Hygiene</h4>
                    <div class="form-group">
                        <label>Staff uniform/attire is not soiled.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="004" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Staff who are unfit for work due to illness should not report to work.</label>
                        <input type="number"  min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="005" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="006" onInput={this.saveScore}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (40%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Adequate and regular pest control. Pest control record.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="007" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Goods and equipment are within shop boundary.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="008" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Store display/ Shop front is neat and tidy.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="009" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Work/ serving area is neat, clean and free of spillage.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="010" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Uncluttered circulation space free of refuse/ furniture.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="011" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="012" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Ceiling/ ceiling boards are free from stains/ dust with no gaps.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="013" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="014" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Equipment is clean, in good condition and serviced.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="015" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Surfaces, walls and ceilings within customer areas are dry and clean.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="016" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Floor within customer areas is clean and dry.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="017" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Waste is properly managed and disposed.</label>
                        <ul>
                            <li key="018.1">Waste bins are not over-filled.</li>
                            <li key="018.2">Waste Management: Proper disposal of general waste.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="018" onInput={this.saveScore}/>
                    </div>

                    <h3>3. Workplace Safety &#38; Health (40%)</h3>
                    <h4>General Safety</h4>
                    <div class="form-group">
                        <label>MSDS for all industrial chemicals are available and up to date.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="019" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper chemicals storage.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="020" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All detergent and bottles containing liquids are labelled appropriately.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="021" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>All personnel to wear safety shoes and safety attire where necessary.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="022" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Knives and sharp objects are kept at a safe place.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="023" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Area under the sink should not be cluttered with items other than washing agents.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="024" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Delivery personnel do not stack goods above the shoulder level.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="025" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="026" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="027" onInput={this.saveScore}/>
                    </div>
                    <h4>Fire &#38; Emergency Safety</h4>
                    <div class="form-group">
                        <label>Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="028" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Escape route and exits are unobstructed.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="029" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>First aid box is available and well-equipped.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="030" onInput={this.saveScore}/>
                    </div>
                    <h4>Electrical Safety</h4>
                    <div class="form-group">
                        <label>Electrical sockets are not overloaded – one plug to one socket.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="031" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Plugs and cords are intact and free from exposure/ tension with PSB safety mark.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="032" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="033" onInput={this.saveScore}/>
                    </div>
                    <div class="form-group">
                        <label>Electrical panels / DBs are covered.</label>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="034" onInput={this.saveScore}/>
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
            newProfStaffHydScore = (newProfStaffHydScore / 60) * 20;
            newFinalDict["profStaffHydScore"] = newProfStaffHydScore;

        }
        else if (qnId >= 7 &&  qnId <= 18) {
            newHouseGeneralScore += parseInt(qnValue);
            newHouseGeneralScore = (newHouseGeneralScore / 120) * 40;
            newFinalDict["houseGeneralScore"] = newHouseGeneralScore;
        }
        else if (qnId >= 19) {
            newWorkSafetyHealthScore += parseInt(qnValue);
            newWorkSafetyHealthScore = (newWorkSafetyHealthScore / 160) * 40;
            newFinalDict["workSafetyHealthScore"] = newWorkSafetyHealthScore;
        }

        let total = newProfStaffHydScore + newHouseGeneralScore + newHouseGeneralScore;

        this.setState({
            profStaffHydScore: newProfStaffHydScore,
            houseGeneralScore: newHouseGeneralScore,
            workSafetyHealthScore: newWorkSafetyHealthScore,
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
            
            axios.post("http://localhost:5000/auditChecklistNonFB", this.state.finalDict, headers
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
            profStaffHydScore = (profStaffHydScore / 60) * 20;
            houseGeneralScore = (houseGeneralScore / 120) * 40;
            workSafetyHealthScore = (workSafetyHealthScore / 160) * 40;

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

export default AuditChecklistNonFB;