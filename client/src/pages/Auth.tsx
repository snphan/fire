import { GET_USER_BY_EMAIL } from '../queries';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { REACT_APP_GOOGLE_CREDS_APPID } from '@/config';
import fire_logo from "../fire_logo.png";

export function Auth({ setAppState, loginUser, setUserInfo, setUserID }: any) {


  const [getUserByEmail, { loading }] = useLazyQuery(GET_USER_BY_EMAIL, {
    fetchPolicy: "no-cache"
  });

  function handleCallbackResponse(res: any) {
    let userObject: any = jwt_decode(res.credential);

    getUserByEmail({
      variables: { email: userObject.email }, onCompleted: (() => {
        const userData = { email: userObject.email, password: userObject.sub };
        loginUser({
          variables: { userData: userData }, onCompleted: (res: any) => {
            setUserID(res.login.id)
          }
        });
        setAppState("dashboard");
      }), onError: (() => {
        setUserInfo(userObject);
        setAppState("signup");
      })
    });
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
    <>
      <img src={fire_logo} id="fire-logo" className="App-logo rounded shadow" alt="logo" />
      <div id="signInDiv"></div>
    </>
  )

}