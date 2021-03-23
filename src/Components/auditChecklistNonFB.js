import React, { Component } from 'react';
import axios from "axios";

class AuditChecklistNonFB extends Component {

    // TODO: Add more auditors

    state = { 
        // 34
        numQuestion: 34,
        auditType: "-1",
        profStaffHydScore: 0,
        houseGeneralScore: 0,
        workSafetyHealthScore: 0,
        totoalScore: 0,
        score: {},
        scoreDict: {}
    }

    

    render() {

        return (
            <div>
                <h2>New Audit</h2>
                <h2>Audit Checklist (Non-F&#38;B)</h2>
                <form>
                    <div class="form-group">
                        <label>Auditee:</label>
                        <input type="text" onInput={this.handler1}/>
                    </div>
                    <p>Auditors:</p>
                    <div class="form-group">
                        <label>Auditor's Name:</label>
                        <input type="text" onInput={this.handler1} placeholder="Auditor's Name"/>
                        <label>Auditor's Department:</label>
                        <input type="text" onInput={this.handler1} placeholder="Auditor's Department"/>
                    </div>
                    <h3>1. Professionalism &#38; Staff Hygiene (10%)</h3>
                    <h4>Professionalism</h4>
                    <div class="form-group">
                        <label>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="001" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Staff Attendance: adequate staff for peak and non-peak hours.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="002" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="003" onInput={this.handler1}/>
                    </div>


                    <h4>Staff Hygiene</h4>
                    <div class="form-group">
                        <label>Staff uniform/attire is not soiled.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="004" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Staff who are unfit for work due to illness should not report to work.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="005" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="006" onInput={this.handler1}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (40%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Adequate and regular pest control. Pest control record.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="007" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Goods and equipment are within shop boundary.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="008" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Store display/ Shop front is neat and tidy.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="009" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Work/ serving area is neat, clean and free of spillage.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="010" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Uncluttered circulation space free of refuse/ furniture.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="011" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="012" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Ceiling/ ceiling boards are free from stains/ dust with no gaps.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="013" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Fans and air-con units are in proper working order and clean and free from dust. Proper maintenance and routine cleaning are carried out regularly.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="014" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Equipment is clean, in good condition and serviced.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="015" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Surfaces, walls and ceilings within customer areas are dry and clean.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="016" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Floor within customer areas is clean and dry.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="017" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Waste is properly managed and disposed.</label>
                        <ul>
                            <li>Waste bins are not over-filled.</li>
                            <li>Waste Management: Proper disposal of general waste.</li>
                        </ul>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="018" onInput={this.handler1}/>
                    </div>

                    <h3>Workplace Safety &#38; Health (40%)</h3>
                    <h4>General Safety</h4>
                    <div class="form-group">
                        <label>MSDS for all industrial chemicals are available and up to date.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="019" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Proper chemicals storage.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="020" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>All detergent and bottles containing liquids are labelled appropriately.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="021" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>All personnel to wear safety shoes and safety attire where necessary.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="022" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Knives and sharp objects are kept at a safe place.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="023" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Area under the sink should not be cluttered with items other than washing agents.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="024" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Delivery personnel do not stack goods above the shoulder level.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="025" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="026" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="027" onInput={this.handler1}/>
                    </div>
                    <h4>Fire &#38; Emergency Safety</h4>
                    <div class="form-group">
                        <label>Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="028" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Escape route and exits are unobstructed.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="029" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>First aid box is available and well-equipped.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="030" onInput={this.handler1}/>
                    </div>
                    <h4>Electrical Safety</h4>
                    <div class="form-group">
                        <label>Electrical sockets are not overloaded – one plug to one socket.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="031" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Plugs and cords are intact and free from exposure/ tension with PSB safety mark.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="032" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="033" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Electrical panels / DBs are covered.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="034" onInput={this.handler1}/>
                    </div>
                    <button type="button" onClick={this.tabulateScore}>Tabulate scores</button>

                    <h4>Scoring</h4>
                    <p>Professionalism &#38; Staff Hygiene: {this.state.profStaffHydScore} /20%</p>
                    <p>Housekeeping &#38; General Cleanliness: {this.state.houseGeneralScore} /40%</p>
                    <p>Workplace Safety &#38; Health: {this.state.workSafetyHealthScore} /40%</p>
                    <p>Total Score: {this.state.totoalScore} /100%</p>
                    <label>Comments:</label>
                    <input type="text" />
                </form>
                <button type="submit" onClick={this.handleSubmit}>Submit</button>

            </div>
        )
    }

    handler1 = event => {
        // TODO: [liwen] set 'score' state using input unique 'id' and match with event.target.value (use dictory or array or sth easy to store data)
        var newScoreDict = this.state.scoreDict;
        newScoreDict[event.target.id] = event.target.value;
        this.setState({scoreDict: newScoreDict});

        console.log(this.state.scoreDict);
    }

    handleSubmit = event  => {
        event.preventDefault();
        console.log("final: ", this.state.scoreDict);

        if (Object.keys(this.state.scoreDict).length != this.state.numQuestion) {
            console.log("empty field");
            
        } else { 
            // all data has been filled
            // proceeds to send data to backend

        }
    }

    tabulateScore = event => {
        console.log("length: ", Object.keys(this.state.scoreDict).length);

        if (Object.keys(this.state.scoreDict).length != this.state.numQuestion) {
            console.log("empty field");

            
        } else {
            console.log("all filled");

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

            profStaffHydScore = (profStaffHydScore / 60) * 20;
            houseGeneralScore = (houseGeneralScore / 120) * 40;
            workSafetyHealthScore = (workSafetyHealthScore / 160) * 40;

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

export default AuditChecklistNonFB;