import React , { Component } from 'react';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";
import axios from "axios";
import './CSS/table.css';
import logo from './logo/singhealth.jpg';
import './Navbar.css';
import Navbar from './Navbar';
import styles from './CSS/home.module.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';


// import { CSVLink } from 'react-csv';

// import { ExportToCsv } from 'export-to-csv';



class Adminhome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataType:"User",
      DataTypefinal:"User",
      count:0,
      displayTable:false,
      stundent:[],
      temp:{},
      data:[],
      students: []
    };
    
    
    this.testHandler1 = this.testHandler1.bind(this);
    this.testHandler2 = this.testHandler2.bind(this);
  }
  Datahandler = (event) => {

    this.setState({
        DataType: event.target.value
    })
}
  testHandler1 = event => {
		event.preventDefault();
	
		const headers = {
			'Content-Type': 'application/csv',
			'Access-Control-Allow-Origin': '*',
      withCredentials: true
		};
	
		const data = {
			tableName: this.state.DataType
		};
  
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
   
  	// const csvExporter = new ExportToCsv(options);
    axios.post("http://localhost:5000//download_data_csv", data, headers
		).then(res => {
				console.log(res.data);
				console.log(res);
				const file = new Blob(
					[res.data], 
					{type: 'application/csv'});
					const fileURL = URL.createObjectURL(file);
           const tempLink = document.createElement('a');
          tempLink.href = fileURL;
          tempLink.setAttribute('download', 'filename.csv');
          tempLink.click();
					// window.open(fileURL);
				// csvExporter.generateCsv(this.state.students);
     }); 

		alert("Download success!")
	 //TODO: use a callback to make sure the following call is only made after the previous post call is done
	 
	// axios.get("http://localhost:5000//remove_temp_files", headers
	// 	).then(res => {
	// 		console.log(res);
	// 		}
	// )
   // this.props.history.push( '/table' );
	}
  

  testHandler2 = event => {
		event.preventDefault();
    this.state.DataTypefinal=this.state.DataType;
		const headers = {
			'Content-Type': 'multipart/form-data',
			'Access-Control-Allow-Origin': '*',
      withCredentials: true
		};
	
		const data = {
			tableName: this.state.DataTypefinal
		};

    axios.post("http://localhost:5000//display_data", data, headers
		).then(res => {
		//	console.log(res.data.data);
      this.state.student=res.data.data;
      console.log(this.state.student);
      this.state.count=0;
      if (this.state.DataTypefinal=="User"){
      this.state.students= [{ id: '', firstName: '',lastName: '',  mobile: '',email: '', location: '' }];
      }
      else if((this.state.DataTypefinal=="Photo")){
        this.state.students= [{ id: '', tags: '',date: '',  time: '',notes: '', staffName: '' , tenantName: '', rectified:null }];
      }
      else if((this.state.DataTypefinal=="PhotoNotification")){
        this.state.students= [{ id: '', tags: '',date: '',  time: '',notes: '', staffName: '' , tenantName: '', rectified:null }];
      }
      else if((this.state.DataTypefinal=="TenantPhoto")){
        this.state.students= [{ id: '', tags: '',date: '',  time: '',notes: '', staffName: '' , tenantName: '', rectified:null }];
      }
      else if((this.state.DataTypefinal=="PhotoNotificationFromTenant")){
        this.state.students= [{ id: '', tags: '',date: '',  time: '',notes: '', staffName: '' , tenantName: '', rectified:null }];
      }
      this.state.student.forEach(element => {
        this.state.count++;
        element.id=this.state.count;
        this.state.students.push(element);
        //console.log(element.id=this.state.count);  
     });
     this.forceUpdate();
		})
    if(this.state.displayTable===true){
      console.log("\n\n truning false");  
      //this.state.displayTable=false;
      
    }
    else{
    this.state.displayTable=true;  
    console.log("\n\n truning true");

    }
    
		alert("Data retrieval success!")
    //this.props.history.push( '/table' );

	}
  //------------GENERATE PDF---------------------------------
  Navbar() {
    return (
          <div className='navbar'>
            <Link to='#' className='menu-bars'>
            <img src={logo}  width="70" height="70" margin="3000px" margin-bottom="-30"  alt="Logo"  />
            </Link>
          </div>

    );
  }
  //--------------TABLE----------------------------------------------------
  renderTableDataUser() {
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
 renderTableDataPhoto() {
  return this.state.students.map((student, index) => {
     const { id,tags, date,time, notes, staffName,tenantName,rectified } = student //destructuring
     return (

        <tr key={id}>
           <td>{id}</td>
           <td>{tags}</td>
           <td>{date}</td>
           <td>{time}</td>
           <td>{notes}</td>
           <td>{staffName}</td>
           <td>{tenantName}</td>
           <td>{rectified?"True": rectified==null?"":"False"}</td>
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
             {(this.state.DataTypefinal=="User") ?this.renderTableDataUser():this.renderTableDataPhoto()}
          </tbody>
       </table>
    </div>
 )
}
componentDidMount() {
  axios.get("http://localhost:5000/get_current_username_and_datetime", {withCredentials: true})
  .then(
      res => {
          console.log(res.data);
          if(res.data.username==""){
            alert("Please Log in!");
            this.props.history.push('/');
          }
      }
  )
}
	render() {
    // const headers = {
		// 	'Content-Type': 'multipart/form-data',
		// 	'Access-Control-Allow-Origin': '*'
		// };
	
		// const data = {
		// 	tableName: this.state.DataType
		// };

    // axios.post("http://localhost:5000//display_data", data, headers
		// ).then(res => {
		// //	console.log(res.data.data);
    //   this.state.student=res.data.data;
    //   console.log(this.state.student);
    //   this.state.count=0;
    //   this.state.students= [
    //     { id: '', firstName: '',lastName: '',  mobile: '',email: '', location: '' }];
    //   this.state.student.forEach(element => {
    //     this.state.count++;
    //     element.id=this.state.count;
    //     this.state.students.push(element);
    //     //console.log(element.id=this.state.count);  
    //  });
    // // this.forceUpdate();
		// })
    
		return (
      
      <div className='home' className={styles.body}>
        {this.Navbar()}

      <div class="container21" >
      

   
        <h1>Admin Home</h1>
        <label>Type of data :</label><select id="data" onChange={this.Datahandler} defaultValue="none">
                        <option defaultValue>Select excel type</option>
                        <option value="User">User</option>
                        <option value="Photo">Photo</option>
                        <option value="PhotoNotification">PhotoNotification</option>
                        <option value="TenantPhoto">tenant_Photo</option>
                        <option value="PhotoNotificationFromTenant">PhotoNotification_from_tenant</option>
                    </select><br />
                    
        <button id="download_data_csv" onClick={this.testHandler1}>download_data_csv</button>
        <label>      </label>
         <button id="display_data" onClick={this.testHandler2}>display_data</button>
         
         {/* <form onSubmit={this.testHandler2}>
                    <label>Type of user :</label><select onChange={this.Datahandler} defaultValue="none">
                        <option defaultValue>Select excel type</option>
                        <option value="User">User</option>
                        <option value="Photo">Photo</option>
                    </select><br />

                    <input type="submit" value="Submit"  />
                </form > */}
        <div className='form-container'>
       {(this.state.displayTable) ?this.rendervalue():this.state.displayTable}
       </div>
       </div>
       </div>
   

		  );
		
	}

	
}



export default Adminhome;