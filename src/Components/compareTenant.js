import React, { Component } from 'react'
import Navbar from './Navbar';
import axios from "axios";
import mainStyle from './CSS/home.module.css';
import uploadStyle from './CSS/upload.module.css';

class CompareTenant extends Component {

    state = {
        instituteArray: [],
        institute1: "",
        institute2: "",
        instituteName1: "",
        instituteName2: "",
        numOfInstitute: [],
        typeArray: ["F&B", "Non-F&B"],
        typeSelection: ""
    }

    componentDidMount() {
        try {
            axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
            .then(
                res => {
                    console.log(res.data);
                    if(res.data.username==""){
                      alert("Please Log in!");
                      this.props.history.push('/');
                    }
                }
            );
            axios.get("http://localhost:5000/tenant_list", {withCredentials: true})
            .then(
                res => {
                    console.log(res);
    
                    for (var i = 0; i < res.data.tenant_list.length; i++) {
                        let newArray1 = this.state.instituteArray;
                        let newArray2 = this.state.numOfInstitute;
                        newArray1.push(res.data.tenant_list[i]);
                        newArray2.push(i);
                        this.setState({instituteArray: newArray1, numOfInstitute: newArray2});
                    }
    
                }
            );
        } catch (e) { console.log(e); }
    }
    
    render() {
        
        return (
            <div className={uploadStyle.body}>
                <Navbar/>
                <div className={mainStyle.main_header_container}>
                    <h2 className={mainStyle.main_header}>Compare between institutions/across clusters</h2>
                </div>
                <div  className={uploadStyle.info_body}>
                    <form>
                        <label className={uploadStyle.info_label}>Type:</label>
                        <select id="type" class="custom-select my-1 mr-sm-2" onChange={this.saveType}>
                            <option selected>Choose...</option>
                            { this.state.typeArray.map(index => <option value={index}>{index}</option> ) }
                        </select><br />

                        <label className={uploadStyle.info_label}>Name of institution/cluster 1:</label>
                        <select id="selector" class="custom-select my-1 mr-sm-2" onChange={this.saveInstitute1}>
                            <option selected>Choose...</option>
                            { this.state.numOfInstitute.map(index => <option value={index.toString()}>{this.handleInstitue(index)}</option> ) }
                        </select><br />
                        
                        <label className={uploadStyle.info_label}>Name of institution/cluster 2:</label>
                        <select id="selector2" class="custom-select my-1 mr-sm-2" onChange={this.saveInstitute2}>
                            <option selected>Choose...</option>
                            { this.state.numOfInstitute.map(index => <option value={index.toString()}>{this.handleInstitue(index)}</option> ) }
                        </select><br />
                    </form>
                </div>

                <div>
                    <button id= "button" type="button" class={this.getButtonClasses()} onClick={this.compare}>Compare</button>
                </div>
            </div>
        )
    }

    saveType = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({typeSelection: ""});
        } else {
            this.setState({typeSelection: data});
            if (data === this.state.typeArray[0]) {
                try {
                    axios.get("http://localhost:5000/tenant_list_FB", {withCredentials: true})
                    .then(
                        res => {
                            console.log("FB list: ", res.data);
                            this.resetInstituteArray();
                            this.resetNumOfInstituteArray();
                            if (res.data.result === true) {
                                for (var i = 0; i < res.data.tenant_list.length; i++) {
                                    let newArray1 = this.state.instituteArray;
                                    let newArray2 = this.state.numOfInstitute;
                                    newArray1.push(res.data.tenant_list[i]);
                                    newArray2.push(i);
                                    this.setState({instituteArray: newArray1, numOfInstitute: newArray2});
                                }
                            }
                        }
                    )
                } catch (e) {
                    console.log(e);
                }
            } else if (data === this.state.typeArray[1]) {
                try {
                    axios.get("http://localhost:5000/tenant_list_non_FB", {withCredentials: true})
                    .then(
                        res => {
                            console.log("Non-FB list: ", res.data);
                            this.resetInstituteArray();
                            this.resetNumOfInstituteArray();
                            if (res.data.result === true) {
                                for (var i = 0; i < res.data.tenant_list.length; i++) {
                                    let newArray1 = this.state.instituteArray;
                                    let newArray2 = this.state.numOfInstitute;
                                    newArray1.push(res.data.tenant_list[i]);
                                    newArray2.push(i);
                                    this.setState({instituteArray: newArray1, numOfInstitute: newArray2});
                                }
                            }
            
                        }
                    )
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    resetInstituteArray = () => {
        this.setState({instituteArray: []})
    }

    resetNumOfInstituteArray = () => {
        this.setState({numOfInstitute: []})
    }

    handleInstitue = (index) => {
        if (this.state.instituteArray.length === 0){
            return "-";
        } else {
            return this.state.instituteArray[index]["firstName"] + " " + this.state.instituteArray[index]["lastName"];
        }
    }

    saveInstitute1 = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({institute1: "", instituteName1: ""});
        } else {
            const index = parseInt(data);
            const name = this.state.instituteArray[index]["firstName"] + " " + this.state.instituteArray[index]["lastName"];
            this.setState({institute1: this.state.instituteArray[index]["email"], instituteName1: name});
        }
    }

    saveInstitute2 = (event) => {
        const data = event.target.value;
        if (data === "Choose...") {
            this.setState({institute2: "", instituteName2: ""});
        } else {
            const index = parseInt(data);
            const name = this.state.instituteArray[index]["firstName"] + " " + this.state.instituteArray[index]["lastName"];
            this.setState({institute2: this.state.instituteArray[index]["email"], instituteName2: name});
        }
    }

    validateField = () => {
        const institute1 = this.state.institute1;
        const institute2 = this.state.institute2;
        const typeSelection = this.state.typeSelection;

        if (institute1.length === 0 || institute2.length === 0 || typeSelection.length === 0) {
            return false;
        }
        else if (institute1 === institute2) {
            return false;
        } 
        else {
            return true;
        }

    }

    compare = event => {
        event.preventDefault();
        try {
            if (this.validateField()) {
                let compareTenantList = {
                    institute1: this.state.institute1,
                    institute2: this.state.institute2,
                    instituteName1: this.state.instituteName1,
                    instituteName2: this.state.instituteName2,
                    typeSelection: this.state.typeSelection
                };
        
                console.log(compareTenantList);
                this.props.history.push({
                    pathname: '/dataDashboardCompareTenant',
                    state: { compareTenantList: compareTenantList}
                });
                
                alert("Send data success!");
            } else {
                alert("Please fill up all fields.");
            }
        } catch (e) {
            alert("Unsuccessful. Please try again.");
        }

    }


    getButtonClasses() {
        let classes = 'btn btn-';
        classes += this.validateField() === false ? 'secondary' : 'primary';
        return classes;
    }

}

export default CompareTenant;