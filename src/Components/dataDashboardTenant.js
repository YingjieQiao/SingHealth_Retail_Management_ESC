import React, { Component } from 'react'
import Navbar from './Navbar';

class DataDashboardTenant extends Component {

    state = {
        tenantName: this.props.location.state.tenantName,
        graph: null
    }

    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>{this.state.tenantName}'s Performance Score</h3>
                <div class="btn-group" role="group" aria-label="Performance Score Trend Variation">
                    <button type="button" class="btn btn-outline-primary" value="yearly" onClick={this.handleGetTrend}>Yearly</button>
                    <button type="button" class="btn btn-outline-primary" value="monthly" onClick={this.handleGetTrend}>Monthly</button>
                    <button type="button" class="btn btn-outline-primary" value="weekly" onClick={this.handleGetTrend}>Weekly</button>
                    <button type="button" class="btn btn-outline-primary" value="7days" onClick={this.handleGetTrend}>7 days</button>
                </div>
                <div>
                    <button type="button" class={this.getButtonClasses()} onClick={this.handleExport}>Export Graph to excel</button>
                </div>
            </div>
        )
    }

    handleGetTrend = event => {
        switch(event.target.value) {
            case "yearly":
                // TODO: get 'yearly' graph 
                break;
            case "monthly":
                // TODO: get 'monthly' graph 
                break;
            case "weekly":
                // TODO: get 'weekly' graph
                break;
            case "7days":
                // TODO: get '7days' graph
                break;
            default:
                // TODO: get 'yearly' graph 
        }
    }

    handleExport = event => {
        // TODO: export graph to excel format
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.state.graph === null ? 'secondary' : 'primary';
        return classes;
    }
}

export default DataDashboardTenant;