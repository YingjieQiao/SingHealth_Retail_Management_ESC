import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import { MdSystemUpdate } from 'react-icons/md';

class DataDashboard extends Component {

    state = {
        tenantName: null
    }

    handleChange = event => {
        this.setState({
            tenantName: event.target.value
        });
        if (this.state.tenantName === null ){
            this.getButtonClasses();
        }
    }

    handleSubmit = event => {
        if (this.state.tenantName === null || this.state.tenantName == "") {
            alert("Error: No input");
        } else {
            alert('tenantName is: ' + this.state.tenantName);
            // TODO: Check if tenant exist
            const det = {
                tenantName: this.state.tenantName
            }
            
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            };
            console.log('Show error notification!')
            axios.post(`http://localhost:5000/tenant_exists`, det, headers)
            .then(res => {
                console.log(res.data);
                if (res.data.result === true) {
                    alert("Tenant exists!","yolo");
                } else {
                    alert("Tenant does not exist");
                }
            }).catch(
                function (error) {
                  console.log('Error!')
                  return Promise.reject(error)
                })
            // Navigate to Tenant's performance score board if successful
            this.props.history.push({
                pathname: '/dataDashboardTenant',
                state: { tenantName: this.state.tenantName }
            });

        }
    }

    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>Get Tenant's Statistics</h3>
                <form>
                    <label>Name of Tenant:</label>
                    <input type="text" value={this.state.tenantName} onChange={this.handleChange} placeholder="Name of Tenant"/>
                </form>
                <button type="submit" class={this.getButtonClasses()} onClick={this.handleSubmit}>Find</button>

            </div>
        )
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.state.tenantName === (null || "" ) ? 'secondary' : 'primary';
        return classes;
    }
}

export default DataDashboard;