import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from "axios";

class CompareTenant extends Component {

    state = {
        instituteArray: [],
        institute1: "",
        institute2: "",
        numOfInstitue: [],
        selectedRange: 0,
    }

    componentDidMount() {
        axios.get("http://localhost:5000/tenant_list")
        .then(
            res => {
                console.log(res);

                for (var i = 0; i < res.data.tenant_list.length; i++) {
                    let newArray1 = this.state.instituteArray;
                    let newArray2 = this.state.numOfInstitue;
                    newArray1.push(res.data.tenant_list[i]);
                    newArray2.push(i);
                    this.setState({instituteArray: newArray1, numOfInstitue: newArray2});
                }

            }
        )
    }


    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Compare between institutions/across clusters</h2>
                <form>
                    <div>
                        <label>Name of institution/cluster 1</label>
                        <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.saveInstitute1}>
                            <option selected>Choose...</option>
                            { this.state.numOfInstitue.map(index => <option value={this.handleInstitue(index)}>{this.handleInstitue(index)}</option> ) }
                        </select>
                    </div>
                    <div>
                        <label>Name of institution/cluster 2</label>
                        <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.saveInstitute2}>
                            <option selected>Choose...</option>
                            { this.state.numOfInstitue.map(index => <option value={this.handleInstitue(index)}>{this.handleInstitue(index)}</option> ) }
                        </select>
                    </div>
                    <div>
                        <label >Select a range</label>
                        <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.saveRange}>
                            <option selected>Choose...</option>
                            <option value="1">Yearly</option>
                            <option value="2">Monthly</option>
                            <option value="3">Weekly</option>
                            <option value="4">7 days</option>
                        </select>
                    </div>
                </form>
                <div>
                    <button type="button" class={this.getButtonClasses()} onClick={this.submit}>Compare</button>
                </div>
            </div>
        )
    }

    handleInstitue = (index) => {
        if (this.state.instituteArray.length === 0){
            return "-";
        } else {
            return this.state.instituteArray[index]["email"];
        }
    }

    saveInstitute1 = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({institute1: ""});
        } else {
            this.setState({institute1: data});
        }
    }

    saveInstitute2 = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({institute2: ""});
        } else {
            this.setState({institute2: data});
        }
    }

    saveRange = event => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({selectedRange: 0});
        } else {
            this.setState({selectedRange: data});
        }
    }

    validateField = () => {
        let institute1 = this.state.institute1;
        let institute2 = this.state.institute2;
        let selectedRange = this.state.selectedRange;
        console.log(institute1, institute2, selectedRange);

        if (institute1.length === 0 || institute2.length === 0 || selectedRange === 0) {
            return false;
        }
        else if (institute1 === institute2) {
            return false;
        } 
        else {
            return true;
        }

    }

    submit = event => {
        event.preventDefault();

        let compareTenantList = {
            institute1: this.state.institute1,
            institute2: this.state.institute2,
            selectedRange: this.state.selectedRange,
        };

        console.log("result: ", compareTenantList);

        // proceeds to send to backend  
        const data = new FormData();
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*'
        };

        data.append("compareTenantList", compareTenantList);
        axios.post("http://localhost:5000/compare_tenant", data, headers
        ).then( res => {
            console.log(data);
            console.log(res.statusText);
        })
        
        alert("Send data success!");
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateField() === false ? 'secondary' : 'primary';
        return classes;
    }

}

export default CompareTenant;