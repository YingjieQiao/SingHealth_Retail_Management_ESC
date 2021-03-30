import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from 'axios';


class DataDashboardCompareTenant extends Component {

    state = {
        institute1: this.props.location.state.compareTenantList["institute1"],
        institute2: this.props.location.state.compareTenantList["institute2"],
        graph: null
    }


    componentDidMount() {
        console.log("institute1: ", this.state.institute1);
        console.log("institute2: ", this.state.institute2);
        const data = {
            institute1: this.state.institute1,
            institute2: this.state.institute2,
        };
        axios.post("http://localhost:5000/compare_tenant", data)
        .then(
            res => {
                console.log(res);

                // for (var i = 0; i < res.data.tenant_list.length; i++) {
                //     let newArray1 = this.state.instituteArray;
                //     let newArray2 = this.state.numOfInstitue;
                //     newArray1.push(res.data.tenant_list[i]);
                //     newArray2.push(i);
                //     this.setState({instituteArray: newArray1, numOfInstitue: newArray2});
                // }

            }
        )
    }

    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Data Dashboard</h2>
                <h3>{this.state.tenant}'s Performance Score</h3>
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

export default DataDashboardCompareTenant;