import React, { useEffect, useState } from 'react';
import './App.css';
import { useMutation } from '@apollo/client';
import { SignUpForm } from './pages/SignUp';
import { LOGIN_USER, LOGOUT_USER } from './mutations';
import { Auth } from './pages/Auth';
import { RealEstateTracker } from 'pages/RealEstateTracker';
import { Dashboard } from 'pages/Dashboard';

declare global {
  /* google variable is loaded from script in public/index.html */
  const google: any;
}

function App() {

  /* appState manages which "page" to show */
  const [appState, setAppState] = useState<string>("auth");

  /* Auth Methods */
  const [loginUser, {
    loading: loginLoading,
  }] = useMutation(LOGIN_USER);
  const [logoutUser, {
    loading: logoutLoading }] = useMutation(LOGOUT_USER);

  /* Google Profile To Be Used During Signup */
  const [userInfo, setUserInfo] = useState<any>(undefined);

  const endSession = () => {
    logoutUser();
    setUserInfo(undefined);
    setAppState("auth");
  }

  const renderState = (appState: string) => {
    switch (appState) {
      case "auth":
        return (<Auth setUserInfo={setUserInfo} loginUser={loginUser} setAppState={setAppState} />);
      case "signup":
        return (<SignUpForm user={userInfo} setUserInfo={setUserInfo} goBackToLogin={() => {
          setAppState("auth");
          setUserInfo(undefined);
        }} />);
      case "dashboard":
        return (<Dashboard />);
      case "real-estate-tracker":
        return (<RealEstateTracker />);
      default:
        return <></>
    }
  }

  return (
    <div className="App App-header">
      {renderState(appState)}
    </div >
  );
}

export default App;
