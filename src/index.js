import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Upload from './components/upload';
import "bootstrap/dist/css/bootstrap.css";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Upload />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
