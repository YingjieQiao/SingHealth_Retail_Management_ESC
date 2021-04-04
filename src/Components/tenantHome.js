import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';
import TenantNotificationModal from './tenantNotificationModal';

// function tenantHome() {
//   localStorage.setItem("usertype","tenant")  ;
//   return (
//     <div className='home'>
//             <TenantNavbar/>
//         <h1>Tenant User Homepage</h1>
//     </div>
//   );
// }

class tenantHome extends Component { 

  state = {
    data: null,
  }

  componentDidMount() {
    axios.get("http://localhost:5000/tenant_get_photo_notification")
    .then(
        res => {
            console.log(res);
            this.setState({data: res.data["tenantData"]});
        }
    )
  }

  render() {
    return (
      <div className='home'>
        <TenantNavbar/>
        <h1>Tenant User Homepage</h1>
        <div>
          {this.displayInfo()}
        </div>
      </div>
    )
  }

  displayInfo() {
    try {
      if (this.state.data.length !== 0) {
        return <TenantNotificationModal /> 
      } else {
        return (
          <div>
            <label>No notification.</label>
          </div>
        )
      }
    } catch (e) {

    }

  }

}

export default tenantHome;