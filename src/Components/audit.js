import React, { Component } from 'react'
import Navbar from './Navbar';
import AuditChecklistNonFB from './auditChecklistNonFB';
import AuditChecklistTest from './auditChecklistTest';
import axios from 'axios';
class Audit extends Component {

    // TODO: Add more auditors

    state = {
        auditType: "-1"
    }

    
    componentDidMount() {
        axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
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
                {/* <AuditChecklistTest /> */}
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
                break;
            case "2":
                return <AuditChecklistNonFB />;
            case "3":
                return <AuditChecklistTest />;
            case "4":
                break;
            default:
                return <p style={{fontStyle: 'italic'}} className="text-info">Please choose a form.</p>
        }
    }

}

export default Audit;