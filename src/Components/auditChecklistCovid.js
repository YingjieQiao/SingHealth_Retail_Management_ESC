import React, { Component } from 'react';
import axios from "axios";

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
        options: ["No", "Yes", "NA"]
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

                    <h4>Part 1: Safe Management Measures for Front-of-house</h4>
                    <div class="form-group">
                        <label>SafeEntry has been implemented for dine-in customers.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="001" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Temperature screening is conducted for customers of outlets that are located outside of institution’s temperature screening zone.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="002" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Table and seating arrangement adheres to the one-metre spacing between tables or groups. Where tables/seats are fixed, tables/seats should be marked out, ensuring at least one-metre spacing.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="003" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Queue is demarcated to ensure at least one-metre spacing between customers such as entrances and cashier counters (e.g. through floor markers).</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="004" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Staff to ensure customers maintain safe distance of one-metre when queuing and seated.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="005" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Staff to ensure customers wear a mask at all times, unless eating or drinking.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="006" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Hand sanitizers are placed at high touch areas (i.e. tray return, collection point, outlet entrance/exit).</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="007" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Outlet promotes use of cashless payment modes.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="008" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>


                    <h4>Part 2: Staff Hygiene &#38; Safe Management Measures</h4>
                    <div class="form-group">
                        <label>All staff to wear a mask at all times, unless eating or drinking.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="009" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Mask worn by staff is in the correct manner (i.e. cover nose and mouth, no hanging of mask under the chin/neck).</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="010" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>All staff to record their temperature daily.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="011" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Staff to maintain safe distance of one-metre (where possible) and not congregate, including at common areas, and during break/meal times.</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="012" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>
                    <div class="form-group">
                        <label>Check with supervisor that all staff record SafeEntry check-in and check-out (Note: Supervisor is accountable for adherence)</label>
                        { this.state.options.map(index => 
                        <div>
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value={index.toString()} id="013" onInput={this.saveScore}/>
                            <label class="form-check-label" for="inlineCheckbox1">{index.toString()}</label>
                        </div>
                        ) }
                    </div>

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

    handleSubmit = event  => {
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
                'Access-Control-Allow-Origin': '*'
            };
            
            axios.post("http://localhost:5000/covidChecklist", this.state.scoreDict, headers
            ).then( res => {
                console.log(res.statusText);
                alert("The form has been successfully recorded.");
            });
        }
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