import React, { useEffect, useState } from 'react';
import '@/App.css';
import { useMutation } from '@apollo/client';
import { SignUpForm } from './pages/SignUp';
import { LOGIN_USER, LOGOUT_USER } from '@/mutations';
import { Auth } from '@/pages/Auth';
import { RealEstateTracker } from '@/pages/RealEstateTracker';
import { Dashboard } from '@/pages/Dashboard';
import { NavBar } from './components/NavBar';

declare global {
  /* google variable is loaded from script in public/index.html */
  const google: any;
}

function App() {

  /* appState manages which "page" to show */
  const [appState, setAppState] = useState<string>("auth");

  /* userID to be set after login */
  const [userID, setUserID] = useState<number | undefined>(undefined);

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
    setUserID(undefined);
    setUserInfo(undefined);
    setAppState("auth");
  }

  const renderState = (appState: string) => {
    switch (appState) {
      case "auth":
        return (<Auth setUserInfo={setUserInfo} loginUser={loginUser} setAppState={setAppState} setUserID={setUserID} />);
      case "signup":
        return (<SignUpForm user={userInfo} setUserInfo={setUserInfo} loginUser={loginUser} setUserID={setUserID} goToDashboard={() => {
          setAppState("dashboard");
          setUserInfo(undefined);
        }} />);
      case "dashboard":
        return (
          <>
            <NavBar setAppState={setAppState} endSession={endSession} currState={appState} />
            <Dashboard setAppState={setAppState} />
          </>
        );
      case "real-estate-tracker":
        return (
          <>
            <NavBar setAppState={setAppState} endSession={endSession} currState={appState} />
            <RealEstateTracker setAppState={setAppState} />
          </>
        );
      default:
        return <></>
    }
  }

  return (
    <div className="App App-header bg-zinc-900">
      {renderState(appState)}
    </div >
  );
}

export default App;
