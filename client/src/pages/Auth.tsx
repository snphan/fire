import { GET_USER_BY_EMAIL } from '../queries';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { REACT_APP_GOOGLE_CREDS_APPID, REACT_APP_SECRET_KEY } from '@/config';
import fire_logo from "../fire_logo.png";
import CryptoJS from 'crypto-js';

export function Auth({ setAppState, loginUser, setUserInfo, setUserID }: any) {


  const [getUserByEmail, { loading }] = useLazyQuery(GET_USER_BY_EMAIL, {
    fetchPolicy: "no-cache"
  });

  function handleCallbackResponse(res: any) {
    let userObject: any = jwt_decode(res.credential);

    getUserByEmail({
      variables: { email: userObject.email }, onCompleted: (() => {
        const encryptedPass = CryptoJS.AES.encrypt(userObject.sub, REACT_APP_SECRET_KEY!).toString()!;
        const userData = { email: userObject.email, password: encryptedPass };
        loginUser({
          variables: { userData: userData }, onCompleted: (res: any) => {
            setUserID(res.login.id)
            setAppState("dashboard");
          }
        });
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
    <div className="min-h-screen text-center flex flex-col items-center justify-center">
      <img src={fire_logo} id="fire-logo" className="m-5 w-48 h-48 rounded shadow" alt="logo" />
      <div id="signInDiv"></div>
    </div>
  )

}