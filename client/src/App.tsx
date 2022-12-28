import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getModeForUsageLocation } from 'typescript';
import { REACT_APP_GOOGLE_CREDS_APPID } from './config';
import jwt_decode from 'jwt-decode';

declare global {
  /* google variable is loaded from script in public/index.html */
  const google: any;
}

function App() {

  const [user, setUser] = useState<any>(undefined);

  function handleCallbackResponse(res: any) {
    console.log(res);
    console.log("Encoded JWT ID token: " + res.credential);
    let userObject = jwt_decode(res.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv")!.hidden = true;
  }

  function handleSignOut() {
    setUser(undefined);
    document.getElementById("signInDiv")!.hidden = false;
  }

  useEffect(() => {
    /* Google Authentication */
    google.accounts.id.initialize({
      client_id: REACT_APP_GOOGLE_CREDS_APPID,
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div id="signInDiv"></div>
        {user &&
          <div>
            <img src={user.picture} alt="" />
            <h3>Welcome {user.name}!</h3>
            <button onClick={() => handleSignOut()}>Sign Out</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
