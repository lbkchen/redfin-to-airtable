import React from 'react';

import logo from '../../assets/img/logo.svg';
import './Popup.css';

import secrets from 'secrets';

const Popup = () => {
  const [loading, setLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const showSuccessToast = () => {
    setShowSuccess(true);
    setLoading(false);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const clip = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Selected tab
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'clip' },
        async function (response) {
          if (response) {
            const { streetName } = response;

            if (!streetName) {
              return;
            }

            // Create listing via Airtable API
            const API_URL = `https://api.airtable.com/v0/${secrets.AIRTABLE_BASE_KEY}/Listings`;

            setLoading(true);
            const res = fetch(API_URL, {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secrets.AIRTABLE_API_KEY}`,
              },
              body: JSON.stringify({
                fields: {
                  Name: streetName,
                },
              }),
            });
            showSuccessToast();
          }
        }
      );
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loading ? <p>Clipping in progress...</p> : null}
        {showSuccess ? <p>✅ Success!</p> : null}
        {!loading && !showSuccess ? <p>Clip this listing!</p> : null}

        <button onClick={clip} className="button">
          Add to Airtable
        </button>
      </header>
    </div>
  );
};

export default Popup;
