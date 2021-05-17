import React from 'react';

import logo from '../../assets/img/logo.svg';

import './Popup.css';


const Popup = () => {

  const test = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Selected tab
      chrome.tabs.sendMessage(tabs[0].id, {action: "clip"}, function(response) {
        if (response) {
          console.log(response.farewell);
        }
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.js</code> and save to reload.

        </p>
        <button onClick={test}>TEST</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
