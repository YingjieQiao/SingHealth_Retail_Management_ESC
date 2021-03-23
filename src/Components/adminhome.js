import React from 'react';
import {Route, BrowserRouter as Router,Switch,Link,withRouter } from "react-router-dom";

function Adminhome() {
  return (
    <div className='home'>
                    <li>
                         <label>new tenent?  </label>
                        <Link to="/Register">Register</Link>

                     </li>
        <h1>Admin Home</h1>
    </div>
  );
}

export default Adminhome;