import React, { Component } from 'react'
import Navbar from './Navbar';

class Audit extends Component {

    // TODO: Add more auditors

    state = {
        auditType: "-1",
        score: {}
    }


    render() {

        return (
            <div>
                <Navbar/>
                <h2>New Audit</h2>
                <h2>[INCOMPLETE - still doing]</h2>
                <form>
                    <label>Audit checklist for:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditType" onChange={this.handleChange}>
                        <option selected value="-1">Choose...</option>
                        <option value="1">F&#38;B</option>
                        <option value="2">Non-F&#38;B</option>
                        <option value="3">Covid Safe Management Measures</option>
                    </select>
                </form>
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
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="004" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="005" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="006" onInput={this.handler1}/>
                    </div>

                    <h3>2. Housekeeping &#38; General Cleanliness (20%)</h3>
                    <h4>General Environment Cleanliness</h4>
                    <div class="form-group">
                        <label>Shop is open and ready to service patients/visitors according to operating hours.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="007" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>Staff Attendance: adequate staff for peak and non-peak hours.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="008" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="009" onInput={this.handler1}/>
                    </div>
                    
                    <h4>Hand Hygiene Facilities</h4>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="010" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="011" onInput={this.handler1}/>
                    </div>
                    <div class="form-group">
                        <label>At least one (1) clearly assigned person in-charge on site.</label>
                        <input type="number" pattern='^([0-9]|([1-9][0-9])|100)$' id="012" onInput={this.handler1}/>
                    </div>

                    <h4>Scoring</h4>
                    <p>Professionalism &#38; Staff Hygiene:</p>
                    <p>Housekeeping &#38; General Cleanliness:</p>
                    <p>Food Hygiene:</p>
                    <p>Healthier Choice:</p>
                    <p>Workplace Safety &#38; Health:</p>
                    <p>Total Score:</p>
                    <label>Comments:</label>
                    <input type="text" />
                </form>
            </div>
        )
    }

    handleChange = event => {
        this.setState({
            auditType: event.target.value
        });
        alert("type: " + event.target.value);
    }

    handler1 = event => {
        // TODO: [liwen] set 'score' state using input unique 'id' and match with event.target.value (use dictory or array or sth easy to store data)
    }

}

export default Audit;