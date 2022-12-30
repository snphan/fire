import React, { useEffect, useState } from 'react';
import fire_logo from './fire_logo.png';
import './App.css';
import { getModeForUsageLocation } from 'typescript';
import { REACT_APP_GOOGLE_CREDS_APPID } from './config';
import jwt_decode from 'jwt-decode';
import { GET_USER_BY_EMAIL } from './queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { SignUpForm } from './components/SignUpForm';

declare global {
  /* google variable is loaded from script in public/index.html */
  const google: any;
}

function App() {

  const [user, setUser] = useState<any>(undefined);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [userJustRegistered, setUserJustRegistered] = useState<boolean>(false);

  const [getUserByEmail, { loading, error, data, client }] = useLazyQuery(GET_USER_BY_EMAIL, {
    fetchPolicy: "no-cache"
  });

  function handleCallbackResponse(res: any) {
    setUserJustRegistered(false);
    console.log(res);
    console.log("Encoded JWT ID token: " + res.credential);
    let userObject: any = jwt_decode(res.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv")!.hidden = true;
    document.getElementById("fire-logo")!.hidden = true;
    getUserByEmail({
      variables: { email: userObject.email }, onCompleted: (() => {
        setUserExists(true);
      }), onError: (() => {
        setUserExists(false);
      })
    })
  }

  const endSession = () => {
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
      {userJustRegistered && <div>User Registered</div>}
      <header className="App-header">
        {/* Sign In Screen */}
        <img src={fire_logo} id="fire-logo" className="App-logo rounded shadow" alt="logo" />
        <div id="signInDiv"></div>


        {loading ?
          <div>Loading...</div> :
          <>
            {/* Sign Up Screen If user not Registered*/}
            {(user && !userExists) &&
              <SignUpForm user={user} goBackToLogin={endSession} setUserJustRegistered={setUserJustRegistered} />
            }

            {/* User Logged In */}
            {(user && userExists) &&
              < div className="container-center">
                <img src={user.picture} className="rounded shadow" alt="" />
                <h3>Welcome {user.name}!</h3>
                <button onClick={() => endSession()}>Sign Out</button>
              </div>
            }
          </>
        }
      </header >
    </div >
  );
}

export default App;
