import React, { Component } from 'react'
import Navbar from './Navbar';
import AuditChecklistNonFB from './auditChecklistNonFB';
import AuditChecklistTest from './auditChecklistTest';

class Audit extends Component {

    // TODO: Add more auditors

    state = {
        auditType: "-1"
    }

    

    render() {

        return (
            <div>
                <Navbar/>
                <form>
                    <label>Audit checklist for:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditType" onChange={this.handleChange}>
                        <option selected value="-1">Choose...</option>
                        <option value="1">F&#38;B</option>
                        <option value="2">Non-F&#38;B</option>
                        <option value="3">Covid Safe Management Measures</option>
                    </select>
                </form>                
                <AuditChecklistTest />
            </div>
        )
    }

    handleChange = event => {
        this.setState({
            auditType: event.target.value
        });
        console.log("type: ", event.target.value);
    }

}

export default Audit;