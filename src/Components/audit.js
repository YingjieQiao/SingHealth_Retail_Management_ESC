import React, { Component } from 'react'
import Navbar from './Navbar';
import AuditChecklistNonFB from './auditChecklistNonFB';
import AuditChecklistFB from './auditChecklistFB';
import AuditChecklistCovid from './auditChecklistCovid';
import AuditChecklistTest from './auditChecklistTest';
import styles from "./CSS/audit.module.css";
import axios from 'axios';
import background from './logo/background.jpg';
import mainStyle from './CSS/home.module.css';
import uploadStyle from './CSS/upload.module.css';


class Audit extends Component {

    // TODO: Add more auditors

    state = {
        auditType: "-1"
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
            )
        } catch (e) { console.log(e); }
    } 

    render() {

        return (
            <div className={uploadStyle.body}>
                <Navbar/>
                <div style={{ 
                backgroundImage: `url(${background})`,  backgroundSize: "cover"
                                }}>
        <div class="container21" >
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Audit Form</h2>
                </div>
                <form className={styles.form_layout}>
                    <label className={uploadStyle.info_label}>Select type of audit form:</label>
                    <select class="custom-select my-1 mr-sm-2" id="auditType" onChange={this.handleAuditForm}>
                        <option selected value="-1">Choose...</option>
                        <option value="1">F&#38;B</option>
                        <option value="2">Non-F&#38;B</option>
                        <option value="3">Non-F&#38;B Test</option>
                        <option value="4">Covid Safe Management Measures</option>
                    </select>
                    <div>{this.displayAuditList()}</div>                
                </form>
            </div>
            </div>
            </div>
        )
    }

    handleAuditForm = event => {
        this.setState({
            auditType: event.target.value
        });
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