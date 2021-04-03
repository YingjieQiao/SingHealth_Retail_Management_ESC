import React from 'react';
import TenantNavbar from './Tenant_Navbar';

function tenantHome() {
  localStorage.setItem("usertype","tenant")  ;
  return (
    <div className='home'>
            <TenantNavbar/>
        <h1>Tenant User Homepage</h1>
    </div>
  );
}

export default tenantHome;