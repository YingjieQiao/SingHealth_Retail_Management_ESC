import React, { Component } from 'react';
import TenantNavbar from './Tenant_Navbar';
import axios from 'axios';


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

  componentDidMount() {
    axios.get("http://localhost:5000/tenant_get_photo_notification")
    .then(
        res => {
            console.log(res);

        }
    )
  }

  render() {
    return (
      <div className='home'>
        <TenantNavbar/>
        <h1>Tenant User Homepage</h1>
      </div>
    )
  }
}

export default tenantHome;