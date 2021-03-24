import React , { Component } from 'react';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from "axios";
import './CSS/table.css'

class Adminhome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTable:false,
      stundent:[],
      students: [
        { id: '', firstName: '',lastName: '',  mobile: '',email: '', location: '' },

     ]
    };
    
    
    this.testHandler1 = this.testHandler1.bind(this);
    this.testHandler2 = this.testHandler2.bind(this);
  }
  testHandler1 = event => {
		event.preventDefault();
	
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Access-Control-Allow-Origin': '*'
		};
	
		const data = {
			tableName: "User"
		};

		axios.post("http://localhost:5000/download_data_csv", data, headers
		).then(res => {
			console.log(res);
		})

		alert("Upload success!")
    this.props.history.push( '/table' );
	}

  testHandler2 = event => {
		event.preventDefault();
	
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Access-Control-Allow-Origin': '*'
		};
	
		const data = {
			tableName: "User"
		};

    axios.post("http://localhost:5000//display_data", data, headers
		).then(res => {
		//	console.log(res.data.data);
      this.state.student=res.data.data;
      console.log(this.state.student);
      this.state.student.forEach(element => {
        this.state.students.push(element);

     });
     this.forceUpdate();
		})
    if(this.state.displayTable===true){
      console.log("\n\n truning false");
      this.state.displayTable=false;
      
    }
    else{
    this.state.displayTable=true;  
    console.log("\n\n truning true");

    }
    
		alert("Upload success!")
    //this.props.history.push( '/table' );

	}
  //------------------------------------------------------------------
  renderTableData() {
    return this.state.students.map((student, index) => {
       const { id, firstName,lastName, mobile, email,location } = student //destructuring
       return (
           
          <tr key={id}>
             <td>{id}</td>
             <td>{firstName}</td>
             <td>{lastName}</td>
             <td>{mobile}</td>
             <td>{email}</td>
             <td>{location}</td>
          </tr>
       )
    })
 }

 renderTableHeader() {
    let header = Object.keys(this.state.students[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }
// ---------------------------- 
rendervalue(){
  return (
    <div>
       <h1 id='title'>React Dynamic Table</h1>
       <table id='students'>
          <tbody>
             <tr>{this.renderTableHeader()}</tr>
             {this.renderTableData()}
          </tbody>
       </table>
    </div>
 )
}
	render() {
		return (
			<div>
                <h1>Admin Home</h1>
                <button onClick={this.testHandler1}>download_data_csv</button>
                <button onClick={this.testHandler2}>display_data</button>
                <div className='form-container'>
                {(this.state.displayTable) ?this.rendervalue():this.state.displayTable}
                </div>

            </div>

			
		  );
		
	}

	
}




export default Adminhome;