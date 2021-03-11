import React, { Component } from 'react'
import Navbar from './Navbar';

class CompareTenant extends Component {

    state = {
        institute1: "",
        institute2: "",
        selectedRange: 0,
        validData: false
    }


    render() {
        let classes = this.getButtonClasses();

        return (
            <div>
                <Navbar/>
                <h2>Compare between institutions/across clusters</h2>
                <form>
                    <label>Name of institution/cluster 1</label>
                    <input type="text" class="form-control" id="institute1" onChange={this.handleChange} placeholder="Name of institution/cluster 1" />
                    <label>Name of institution/cluster 2</label>
                    <input type="text" class="form-control" id="institute2" onChange={this.handleChange} placeholder="Name of institution/cluster 2" />
                    <label >Select a range</label>
                    <select class="custom-select my-1 mr-sm-2" id="range" onChange={this.handleChange}>
                        <option selected>Choose...</option>
                        <option value="1">Yearly</option>
                        <option value="2">Monthly</option>
                        <option value="3">Weekly</option>
                        <option value="4">7 days</option>
                    </select>
                </form>
                <div>
                    <button type="button" class={this.getButtonClasses()} onClick={this.handleCompare}>Compare</button>
                </div>
            </div>
        )
    }

    handleChange = event => {
        if (event.target.id == "institute1") {
            this.setState({
                institute1: event.target.value
            })
        } else if (event.target.id == "institute2") {
            this.setState({
                institute2: event.target.value
            })
        } else if (event.target.id == "range") {
            this.setState({
                selectedRange: event.target.value
            })
        }
        if ( (this.state.institute1.trim().length != 0) && (this.state.institute2.trim().length != 0) && (this.state.selectedRange != 0) && (this.state.selectedRange != "Choose...") ) {
            this.setState({
                validData: true
            })
        } else {
            this.setState({
                validData: false
            })
        }
    }


    handleCompare = event => {
        // TODO: [liwen] Handle exceptions, current model is not working properly
        if ( (this.state.institute1.trim().length != 0) && (this.state.institute2.trim().length != 0) && (this.state.selectedRange != 0) && (this.state.selectedRange != "Choose...") ) {
            alert("OK\n" + this.state.institute1 + this.state.institute1 + this.state.selectedRange);
            // TODO: get data from both user
        } else {
            alert("Error: field is missing");
        }
    }

    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.state.validData === false ? 'secondary' : 'primary';
        return classes;
    }

}

export default CompareTenant;