import React , { Component } from 'react';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from "axios";


class Adminhome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true
    };
    this.testHandler = this.testHandler.bind(this);
  }
  testHandler = event => {
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
	
	}
	render() {
		return (
			<div>
                <h1>Admin Home</h1>
                <button onClick={this.testHandler}>test</button>

            </div>

			
		  );
		
	}

	
}




export default Adminhome;