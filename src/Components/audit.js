import React, { Component } from 'react'
import Navbar from './Navbar';
import AuditChecklistNonFB from './auditChecklistNonFB';
import AuditChecklistFB from './auditChecklistFB';
import AuditChecklistCovid from './auditChecklistCovid';
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
                    <select class="custom-select my-1 mr-sm-2" id="auditType" onChange={this.handleAuditForm}>
                        <option selected value="-1">Choose...</option>
                        <option value="1">F&#38;B</option>
                        <option value="2">Non-F&#38;B</option>
                        <option value="3">Non-F&#38;B Test</option>
                        <option value="4">Covid Safe Management Measures</option>
                    </select>
                </form>
                <div>{this.displayAuditList()}</div>                
            </div>
        )
    }

    handleAuditForm = event => {
        this.setState({
            auditType: event.target.value
        });
        console.log("type: ", event.target.value);
    }

    displayAuditList = () => {
        switch (this.state.auditType) {
            case "1":
                return <AuditChecklistFB />;
            case "2":
                return <AuditChecklistNonFB />;
            case "3":
                return <AuditChecklistTest />;
            case "4":
                return <AuditChecklistCovid />;
            default:
                return <p style={{fontStyle: 'italic'}} className="text-info">Please choose a form.</p>;
        }
    }

}

export default Audit;