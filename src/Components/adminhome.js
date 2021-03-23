import React , { Component } from 'react';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from "axios";


class Adminhome extends Component {
	render() {
		return (
			<div>
                <button onClick={this.testHandler}>
					test
				</button>

            </div>

			
		  );
		
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
}




export default Adminhome;