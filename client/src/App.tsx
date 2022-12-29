import React, { useEffect, useState } from 'react';
import fire_logo from './fire_logo.png'
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
    document.getElementById("fire-logo")!.hidden = true;
  }

  function handleSignOut() {
    setUser(undefined);
    document.getElementById("fire-logo")!.hidden = false;
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
      { theme: "filled_blue", shape: "pill", size: "large", text: "sign_in_with" }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {user &&
          <div className="container-center">
            <img src={user.picture} className="rounded shadow" alt="" />
            <h3>Welcome {user.name}!</h3>
            <button onClick={() => handleSignOut()}>Sign Out</button>
          </div>
        }
        <img src={fire_logo} id="fire-logo" className="App-logo rounded shadow" alt="logo" />
        <div id="signInDiv"></div>
      </header>
    </div>
  );
}

export default App;
