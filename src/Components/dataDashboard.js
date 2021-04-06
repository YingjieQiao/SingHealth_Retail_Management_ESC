import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import { MdSystemUpdate } from 'react-icons/md';

class DataDashboard extends Component {

    state = {
        tenantArray: [],
        tenant: "",
        tenantName: "",
        numOfTenant: []
    }

    componentDidMount() {

        try {
            axios.get("http://localhost:5000/tenant_list")
            .then(
                res => {
                    console.log(res);

                    if (res.data.result === true) {
                        for (var i = 0; i < res.data.tenant_list.length; i++) {
                            let newArray1 = this.state.tenantArray;
                            let newArray2 = this.state.numOfTenant;
                            newArray1.push(res.data.tenant_list[i]);
                            newArray2.push(i);
                            this.setState({tenantArray: newArray1, numOfTenant: newArray2});
                        }
                    }
    
                }
            )
        } catch (e) {}

    }

    render() {

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>Get Tenant's Statistics</h3>
                <form>
                    <div>
                        <label>Name of Tenant:</label>
                        <select class="custom-select my-1 mr-sm-2" onChange={this.saveTenant}>
                            <option selected>Choose...</option>
                            { this.state.numOfTenant.map(index => <option value={index.toString()}>{this.handleTenant(index)}</option> ) }
                        </select>
                    </div>
                </form>
                <button type="submit" class={this.getButtonClasses()} onClick={this.handleSubmit}>Find</button>

            </div>
        )
    }

    handleTenant = (index) => {
        if (this.state.tenantArray.length === 0){
            return "-";
        } else {
            return this.state.tenantArray[index]["firstName"] + " " + this.state.tenantArray[index]["lastName"];
        }
    }

    saveTenant = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({tenant: "", tenantName: ""});
        } else {
            const index = parseInt(data);
            const name = this.state.tenantArray[index]["firstName"] + " " + this.state.tenantArray[index]["lastName"];
            this.setState({tenant: this.state.tenantArray[index]["email"], tenantName: name});
        }
    }

    handleSubmit = event => {
        if (this.state.tenant.length === 0) {
            alert("Please select a tenant to retrieve their statistics");
        }
        else {
            // proceeds to retrieve tenant's statistics
            // Navigate to Tenant's performance score board if successful
            let tenantProfile = {
                name: this.state.tenantName,
                email: this.state.tenant
            }
            this.props.history.push({
                pathname: '/dataDashboardTenant',
                state: { tenant: tenantProfile}
            });

        }
    }

    validateField = () => {
        if (this.state.tenant.length === 0) {
            return false;
        }
        else {
            return true;
        }
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateField() === false ? 'secondary' : 'primary';
        return classes;
    }
}

export default DataDashboard;