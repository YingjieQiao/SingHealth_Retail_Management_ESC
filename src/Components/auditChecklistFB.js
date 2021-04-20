import React, { Component } from 'react';
import axios from "axios";
import styles from "./CSS/auditForm.module.css";

class AuditChecklistFB extends Component {

    // TODO: Add more auditors

    // q1: 13
    // q2: 17
    // q3: 37
    // q4: 11
    // q5: 18
    state = { 
        // 34 qn + 1 comment + 3 dropdown
        dataLength: 100,
        auditorName: "",
        auditorDepartment: "",
        auditeeName: "",
        profStaffHydScore: 0,
        housekeepScore: 0,
        foodHydScore: 0,
        healthierScore: 0,
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
            axios.get("http://localhost:5000/tenant_list_FB", {withCredentials: true})
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
                        <label className={styles.form_qn}>Audit Checklist (F&#38;B)</label>
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
                        <label className={styles.heading}>Staff Hygiene</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff who are unfit for work due to illness should not report to work.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="004" id="004" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="005" id="005" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Clean clothes/uniform or aprons are worn during food preparation and food service.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="006" id="006" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Hair is kept tidy (long hair must be tied up) and covered with clean caps or hair nets where appropriate.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="007" id="007" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Sores, wounds or cuts on hands, if any, are covered with waterproof and brightly-coloured plaster.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="008" id="008" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Hands are washed thoroughly with soap and water, frequently and at appropriate times.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="009" id="009" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fingernails are short, clean, unpolished and without nail accessories.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="010" id="010" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>No wrist watches/ rings or other hand jewellery (with exception of wedding ring) is worn by staff handling food.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="011" id="011" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food is handled with clean utensils and gloves.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="012" id="012" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Disposable gloves are changed regularly and/ or in between tasks.</label>
                        <ul>
                            <li key="013">Staff do not handle cash with gloved hands.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="013" id="013" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>


                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 2: Housekeeping &#38; General Cleanliness (20%)</label>
                        <label className={styles.form_qn}>General Environment Cleanliness</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Cleaning and maintenance records for equipment, ventilation and exhaust system.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="014" id="014" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Adequate and regular pest control.</label>
                        <ul>
                            <li key="015">Pest control record.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="015" id="015" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Goods and equipment are within shop boundary.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="016" id="016" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Store display/ Shop front is neat and tidy.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="017" id="017" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Work/ serving area is neat, clean and free of spillage.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="018" id="018" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Uncluttered circulation space free of refuse/ furniture.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="019" id="019" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Tables are cleared promptly within 10 minutes.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="020" id="020" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="021" id="021" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Ceiling/ ceiling boards are free from stains/ dust with no gaps.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="022" id="022" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="023" id="023" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Equipment, exhaust hood, crockery and utensils are clean, in good condition and serviced.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="024" id="024" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Surfaces, walls and ceilings within customer areas are dry and clean.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="025" id="025" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Floor within customer areas is clean, dry and non-greasy.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="026" id="026" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Waste bins are properly lined with plastic bags and covered at all times.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="027" id="027" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Adequate number of covered waste pedal bins are available and waste is properly managed and disposed.</label>
                        <ul>
                            <li key="028.1">Waste bins are not over-filled.</li>
                            <li key="028.2">Waste Management: Proper disposal of food stuff and waste.</li>
                            <li key="028.3">Waste is properly bagged before disposing it at the waste disposal area/ bin centre.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="028" id="028" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>

                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Hand Hygiene Facilities</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Hand washing facilities are easily accessible, in good working condition and soap is provided.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="029" id="029" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Adequate facilities for hand hygiene are available including liquid soap and disposable hand towels.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="030" id="030" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 3: Food Hygiene (35%)</label>
                        <label className={styles.form_qn}>Storage &#38; Preparation of Food</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food is stored in appropriate conditions and at an appropriate temperature.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="031" id="031" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food and non-food are clearly segregated.</label>
                        <ul>
                            <li key="032">Non-food items (e.g. insecticides, detergents and other chemicals) are not stored together with the food items.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="032" id="032" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food is not placed near sources of contamination.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="033" id="033" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Storage of food does not invite pest infestation.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="034" id="034" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Dry goods (e.g. canned food and drinks) and other food items are stored neatly on shelves, off the floor and away from walls.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="035" id="035" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper stock rotation system such as the First-Expired-First-Out (FEFO) system is used for inventory management.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="036" id="036" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food is protected from contamination; packaging is intact and no products are found with signs of spoilage.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="037" id="037" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Ice machine is clean and well maintained.</label>
                        <ul>
                            <li key="038">Only ice is stored in the ice machine to prevent contamination of the ice.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="038" id="038" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Scoop for ice is stored outside the ice machine in a dedicated container.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="039" id="039" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food supplied is clean and not expired.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="040" id="040" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Clear labelling of date of date of preparation/ manufacture/ expiry on all food containers/packaging.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="041" id="041" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Cooked food is properly covered to prevent cross-contamination.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="042" id="042" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper work flow and segregation of areas to prevent cross-contamination between raw and cooked/ ready-to-eat food areas.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="043" id="043" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper separation of cooked food/ ready-to-eat food, raw meat, seafood and vegetable to prevent cross-contamination.</label>
                        <ul>
                            <li key="044.1">E.g. Different chopping boards, knives and other utensils are used for cooked/ ready-to-eat and raw food.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="044" id="044" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Frozen food is thawed in chiller, microwave or under running water.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="045" id="045" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Ingredients used are clean and washed thoroughly before cooking.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="046" id="046" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All cooking ingredient (e.g. cooking oil, sauces) are properly covered in proper containers and properly labelled, indicating the content and date of expiry.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="047" id="047" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All sauces are stored at appropriate condition &#38; temperature.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="048" id="048" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Cooking oil is not used for more than 1 day.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="049" id="049" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Cooking oil is properly stored with a cover.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="050" id="050" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Perishable food is stored in the fridge.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="051" id="051" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Raw food and cooked food/ ready to serve food are clearly segregated.</label>
                        <ul>
                            <li key="052">Cold and/ or hot holding units are clean and well maintained.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="052" id="052" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food preparation area is free of bird and animal (e.g. dog or cat).</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="053" id="053" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food preparation area is clean, free of pests and in good state of repair.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="054" id="054" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food is not prepared on the floor, near drain or near/ in toilet.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="055" id="055" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Personal belongings are kept separately in the staff locker area or cabinet, away from the food storage and preparation area.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="056" id="056" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Storage of Food in Refrigerator/ Warmer</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Daily Temperature Log for food storage units (freezers, chillers, warmers, steamers, ovens) using independent thermometer, etc. is maintained for inspection from time to time.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="057" id="057" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food storage units (freezers, chillers, warmers, steamers, ovens) are kept clean and well maintained. All rubber gaskets of refrigerators / warmers are free from defect, dirt and mould.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="058" id="058" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food storage units are not overstocked to allow good air circulation.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="059" id="059" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>For walk-in freezers and chillers, food items are stored neatly on shelves and off the floor.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="060" id="060" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Frozen food is stored at a temperature of not more than &#45;12°C.</label>
                        <ul>
                            <li key="061">Freezer’s temperature: &#60; &#45;12°.</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="061" id="061" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Chilled food is stored at a temperature of not more than 4°C.</label>
                        <ul>
                            <li key="062">Chiller’s temperature: 0°C &#126; 4°C</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="062" id="062" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Hot food are held above 60°C.</label>
                        <ul>
                            <li key="063">Food warmer’s temperature: &#62; 60°C</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="063" id="063" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Perishable food is stored at a temperature of not more than 4°C.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="064" id="064" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Dairy products are stored at a temperature of not more than 7°C.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="065" id="065" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Cooked/ ready-to-eat food are stored above raw food.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="066" id="066" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Food items are properly wrapped/covered in proper containers and protected from contamination.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="067" id="067" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 4: Healthier Choice in line with HPB’s Healthy Eating’s Initiative (15%)</label>
                        <label className={styles.form_qn}>Food</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Min. no. of healthier variety of food items per stall.</label>
                        <ul>
                            <li key="068">Lease Term: 50% of food items</li>
                        </ul>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="068" id="068" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Label caloric count of healthier options.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="069" id="069" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Include HPB’s Identifiers beside healthier options.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="070" id="070" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Use of healthier cooking oils.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="071" id="071" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Offer wholemeal/ whole-grain option.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="072" id="072" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Healthier option food sold at lower price than regular items.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="073" id="073" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Limit deep-fried and pre-deep fried food items sold (&#8804; 20% deep-fried items).</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="074" id="074" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.form_qn}>Beverage</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>No sugar / Lower-sugar brewed beverage offerings according to guidelines.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="075" id="075" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Healthier option beverages sold at lower price than regular items.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="076" id="076" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Label caloric count of healthier options.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="077" id="077" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Limit sugar content on commercially-prepared sweetened beverages. (&#8805; 70% commercially-prepared sweetened beverages sold to have HCS)</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="078" id="078" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div className={styles.qn_body}>
                        <label className={styles.heading}>Part 5: Workplace Safety &#38; Health (20%)</label>
                        <label className={styles.form_qn}>General Safety</label>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All food handlers have Basic Food Hygiene certificate and a valid Refresher Food Hygiene certificate (if applicable).</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="079" id="079" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>MSDS for all industrial chemicals are available and up to date.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="080" id="080" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper chemicals storage.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="081" id="081" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All detergent and bottles containing liquids are labelled appropriately.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="082" id="082" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>All personnel to wear safety shoes and safety attire where necessary.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="083" id="083" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Knives and sharp objects are kept at a safe place.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="084" id="084" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Area under the sink should not be cluttered with items other than washing agents.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="085" id="085" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Delivery personnel do not stack goods above the shoulder level.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="086" id="086" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="087" id="087" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="088" id="088" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Equipment, crockery and utensils are not chipped, broken or cracked.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="089" id="089" onInput={this.saveScore} value={index} />
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
                            <input class="form-check-input" type="radio" name="090" id="090" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Escape route and exits are unobstructed.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="091" id="091" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>First aid box is available and well-equipped.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="092" id="092" onInput={this.saveScore} value={index} />
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
                            <input class="form-check-input" type="radio" name="093" id="093" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Plugs and cords are intact and free from exposure/ tension with PSB safety mark.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="094" id="094" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="095" id="095" onInput={this.saveScore} value={index} />
                            <label class="form-check-label" >{index}</label>
                        </div>)})}
                        <label>Highest score</label></div>
                    </div>
                    <div class="form-group" className={styles.qn_body}>
                        <label className={styles.form_qn}>Electrical panels / DBs are covered.</label>
                        <div><label>Lowest score</label>
                        {this.state.options.map(index => {return (
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="096" id="096" onInput={this.saveScore} value={index} />
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
            let housekeepScore = 0;
            let foodHydScore = 0;
            let healthierScore = 0;
            let workSafetyHealthScore = 0;
            let newFinalDict = this.state.finalDict;

            for (let k in this.state.scoreDict) {
                let data = this.state.scoreDict[k];
                if (Number.isInteger(parseInt(data))) {
                    if (k <= 13) {
                        profStaffHydScore += parseInt(data);
                    } else if ( k >= 14 &&  k <= 30) {
                        housekeepScore += parseInt(data);
                    } else if ( k >= 31 &&  k <= 67) {
                        foodHydScore += parseInt(data);
                    } else if ( k >= 68 &&  k <= 78) {
                        healthierScore += parseInt(data);
                    } else if (k >= 79 ) {
                        workSafetyHealthScore += parseInt(data);
                    }
                } else {
                    continue;
                }
            }

            // formula: score = (currentScore  / (numQ * maxScoreForOneQ) ) * weightageForTheSection
            profStaffHydScore = (profStaffHydScore / 130) * 10;
            housekeepScore = (housekeepScore / 170) * 20;
            foodHydScore = (foodHydScore / 370) * 35;
            healthierScore = (healthierScore / 110) * 15;
            workSafetyHealthScore = (workSafetyHealthScore / 180) * 20;

            newFinalDict["profStaffHydScore"] = profStaffHydScore;
            newFinalDict["housekeepScore"] = housekeepScore;
            newFinalDict["foodHydScore"] = foodHydScore;
            newFinalDict["healthierScore"] = healthierScore;
            newFinalDict["workSafetyHealthScore"] = workSafetyHealthScore;


            let total = profStaffHydScore + housekeepScore + foodHydScore + healthierScore + workSafetyHealthScore;

            this.setState({
                profStaffHydScore: profStaffHydScore,
                housekeepScore: housekeepScore,
                foodHydScore: foodHydScore,
                healthierScore: healthierScore,
                workSafetyHealthScore: workSafetyHealthScore,
                totoalScore: total,
                finalDict: newFinalDict
            });

        }
    }

    individualScore = () => {
        var individualScoreDict = {
            profStaffHydScore: [],
            housekeepScore: [],
            foodHydScore: [],
            healthierScore: [],
            workSafetyHealthScore: []
        };

        for (let k in this.state.scoreDict) {
            let data = this.state.scoreDict[k];
            if (Number.isInteger(parseInt(data))) {
                if (k <= 13) {
                    individualScoreDict["profStaffHydScore"].push(parseInt(data));
                } else if ( k >= 14 &&  k <= 30) {
                    individualScoreDict["housekeepScore"].push(parseInt(data));
                } else if ( k >= 31 &&  k <= 67) {
                    individualScoreDict["foodHydScore"].push(parseInt(data));
                } else if ( k >= 68 &&  k <= 78) {
                    individualScoreDict["healthierScore"].push(parseInt(data));
                } else if (k >= 79 ) {
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
            this.state.finalDict['housekeepScoreList'] = individualScore["housekeepScore"];
            this.state.finalDict['foodhydScoreList'] = individualScore["foodHydScore"];
            this.state.finalDict['healthierScoreList'] = individualScore["healthierScore"];
            this.state.finalDict['worksafetyhealthScoreList'] = individualScore["workSafetyHealthScore"];

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                withCredentials: true
            };
            
            axios.post("http://localhost:5000/auditChecklistFB", this.state.finalDict, headers
            ).then( res => {
                console.log(res.statusText);
                alert("The form has been successfully recorded.");
            });
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

export default AuditChecklistFB;