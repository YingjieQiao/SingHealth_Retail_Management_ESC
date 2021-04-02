import React from 'react';
import Navbar from './Navbar';

function tenantHome() {
  localStorage.setItem("usertype","tenant")  ;
  return (
    <div className='home'>
            <Navbar usertype="tenant"/>
        <h1>Tenant User Homepage</h1>
    </div>
  );
}

export default tenantHome;