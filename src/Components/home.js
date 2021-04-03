import React from 'react';
import Navbar from './Navbar';

function Home() {
  localStorage.setItem("usertype","staff")  ;
  return (
    <div className='home'>
            <Navbar usertype="staff" />
        <h1>Staff User Homepage</h1>
    </div>
  );
}

export default Home;