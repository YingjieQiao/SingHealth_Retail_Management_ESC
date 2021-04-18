import React, { Component } from 'react';
import axios from "axios";
import styles from "./CSS/auditForm.module.css";


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
                    if(res.data.username==""){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            );
            axios.get("http://localhost:5000/tenant_list_non_FB", {withCredentials: true})
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
                            <li key="018.1">Waste bins are not over-filled.</li>
                            <li key="018.2">Waste Management: Proper disposal of general waste.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="018" id="018" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>

                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 3: Workplace Safety &#38; Health (40%)</label>
                        <label className={styles.form_qn}>General Safety</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>MSDS for all industrial chemicals are available and up to date.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="019" id="019" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper chemicals storage.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="020" id="020" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All detergent and bottles containing liquids are labelled appropriately.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="021" id="021" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All personnel to wear safety shoes and safety attire where necessary.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="022" id="022" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Knives and sharp objects are kept at a safe place.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="023" id="023" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Area under the sink should not be cluttered with items other than washing agents.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="024" id="024" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Delivery personnel do not stack goods above the shoulder level.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="025" id="025" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="026" id="026" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="027" id="027" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Fire &#38; Emergency Safety</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="028" id="028" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Escape route and exits are unobstructed.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="029" id="029" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>First aid box is available and well-equipped.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="030" id="030" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Electrical Safety</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Electrical sockets are not overloaded – one plug to one socket.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="031" id="031" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Plugs and cords are intact and free from exposure/ tension with PSB safety mark.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="032" id="032" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="033" id="033" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Electrical panels / DBs are covered.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="034" id="034" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
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
                } else if (k >= 19 ) {
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
        console.log("final: ", this.state.finalDict);

        if (Object.keys(this.state.scoreDict).length < (this.state.dataLength - 1)) {
            console.log("empty field");
            alert("Please fill up all fields");
        } else { 
            // all data has been filled
            // proceeds to send data to backend
            this.tabulateScore();
            const individualScore = this.individualScore();

            this.state.finalDict['profstaffhydScoreList'] = individualScore["profStaffHydScore"];
            this.state.finalDict['housekeepScoreList'] = individualScore["houseGeneralScore"];
            this.state.finalDict['worksafetyhealthScoreList'] = individualScore["workSafetyHealthScore"];

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*', 
                withCredentials: true
            };
            
            axios.post("http://localhost:5000/auditChecklistNonFB", this.state.finalDict, headers
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