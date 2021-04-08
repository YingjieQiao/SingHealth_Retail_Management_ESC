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
        comment: ""
    }

    componentDidMount() {
        axios.get("http://localhost:5000/if_loggedin")
        .then(
            res => {
                console.log(res.data);
                if(res.data.username==""){
                  alert("Please Log in!");
                  this.props.history.push('/');
                }
            }
        )
      }
        comment: "",
        auditeeArray: [],
        numOfAuditee: [],
        options: [0,1,2,3,4,5,6,7,8,9,10],
        hasSubmitForm: false,
        auditorArray: [],
    }

    componentDidMount() {
        try {
            axios.get("http://localhost:5000/if_loggedin")
            .then(
                res => {
                    console.log(res.data);
                    if(res.data.username==""){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            );
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
            );
            axios.get("http://localhost:5000/staff_list")
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
                        <label className={styles.form_qn}>Audit Checklist (Non-F&#38;B)</label>
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
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff Attendance: adequate staff for peak and non-peak hours.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="002" id="002" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>At least one (1) clearly assigned person in-charge on site.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="003" id="003" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff Hygiene</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff uniform/attire is not soiled.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="004" id="004" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff who are unfit for work due to illness should not report to work.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="005" id="005" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="006" id="006" onInput={this.saveScore} value={index} />
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
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Goods and equipment are within shop boundary.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="008" id="008" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Store display/ Shop front is neat and tidy.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="009" id="009" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Work/ serving area is neat, clean and free of spillage.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="010" id="010" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Uncluttered circulation space free of refuse/ furniture.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="011" id="011" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="012" id="012" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Ceiling/ ceiling boards are free from stains/ dust with no gaps.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="013" id="013" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="014" id="014" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Equipment is clean, in good condition and serviced.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="015" id="015" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Surfaces, walls and ceilings within customer areas are dry and clean.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="016" id="016" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Floor within customer areas is clean and dry.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="017" id="017" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Waste is properly managed and disposed.</label>
                        <ul>
                            <li>Waste bins are not over-filled.</li>
                            <li>Waste Management: Proper disposal of general waste.</li>
                        </ul>
                        <input type="number" min="0" max="10" pattern='^([0-9]|([1-9][0-9])|100)$' id="018" onInput={this.saveScore}/>
                    </div>

                    <h3>Workplace Safety &#38; Health (40%)</h3>
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

        console.log("length: ", Object.keys(this.state.finalDict).length);

        if (Object.keys(this.state.finalDict).length < this.state.dataLength ) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            console.log("sent");
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