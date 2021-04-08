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
        
        axios.get("http://localhost:5000/tenant_list")
        .then(
            res => {
                console.log(res);
                for (var i = 0; i < res.data.tenant_list.length; i++) {
                    let newArray1 = this.state.tenantArray;
                    let newArray2 = this.state.numOfTenant;
                    newArray1.push(res.data.tenant_list[i]);
                    newArray2.push(i);
                    this.setState({tenantArray: newArray1, numOfTenant: newArray2});
                }

            }
        )
    }

    render() {
        let classes = this.getButtonClasses();

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
            // console.log("result: ", this.state.tenant);
            // const det = {
            //     tenant: this.state.tenant
            // }
            
            // const headers = {
            //     'Content-Type': 'application/json',
            //     'Access-Control-Allow-Origin': '*'
            // };
            // console.log('Show error notification!')
            // axios.post(`http://localhost:5000/tenant_exists`, det, headers)
            // .then(res => {
            //     console.log(res.data);
            //     if (res.data.result === true) {
            //         alert("Tenant exists!","yolo");
            //     } else {
            //         alert("Tenant does not exist");
            //     }
            // }).catch(
            //     function (error) {
            //       console.log('Error!')
            //       return Promise.reject(error)
            //     });

            // Navigate to Tenant's performance score board if successful
            this.props.history.push({
                pathname: '/dataDashboardTenant',
                state: { tenant: this.state.tenant }
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