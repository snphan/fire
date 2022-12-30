import React from "react";
import { useState } from "react";
import "../App.css";
import { useMutation } from '@apollo/client';
import { CREATE_USER } from "../mutations";

interface UserInfo {
  email: string,
  last_name: string,
  first_name: string,
  password: string,
  password2: string,
}

export function SignUpForm({ user, goBackToLogin, setUserJustRegistered }: any) {

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: user.email,
    last_name: user.family_name,
    first_name: user.given_name,
    password: "",
    password2: ""
  })
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER);

  if (loading) return <p>Submitting...</p>;
  if (error) return (
    <div>
      <p>Submission error! {error.message} {JSON.stringify(data)}</p>
      <button onClick={() => goBackToLogin()}>Back</button>
    </div>
  );

  const handleRegister = () => {

    if (userInfo.password != userInfo.password2) {
      console.log("Passwords don't match!");
      return
    }

    if (!userInfo.password || !userInfo.password) {
      console.log("please enter a password");
      return
    }

    const { password2, ...userData } = userInfo;
    console.log(userData);

    createUser({ variables: { userData: userData } });
    goBackToLogin();
    setUserJustRegistered(true);
  }

  return (
    <div className="container-center">
      <p>It doesn't seem like you are registered... Please Sign Up</p>
      <div>
        <label htmlFor="Email">Email</label>
        <input type="text" name="" id="Email" value={userInfo.email} onChange={(e) => setUserInfo(({ ...userInfo, email: e.target.value }))} />
      </div>

      <div>
        <label htmlFor="last-name">Last Name</label>
        <input type="text" name="" id="last-name" value={userInfo.last_name} onChange={(e) => setUserInfo(({ ...userInfo, last_name: e.target.value }))} />
      </div>

      <div>
        <label htmlFor="first-name">First Name</label>
        <input type="text" name="" id="first-name" value={userInfo.first_name} onChange={(e) => setUserInfo(({ ...userInfo, first_name: e.target.value }))} />
      </div>

      {(userInfo.password != userInfo.password2) &&
        <div>
          Passwords don't match
        </div>
      }

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="" id="password" onChange={(e) => setUserInfo(({ ...userInfo, password: e.target.value }))} />
      </div>

      <div>
        <label htmlFor="password2">Enter Again</label>
        <input type="password" name="" id="password2" onChange={(e) => setUserInfo(({ ...userInfo, password2: e.target.value }))} />
      </div>

      <div>
        <button onClick={() => goBackToLogin()}>Back</button>
        <button onClick={() => handleRegister()}>Register</button>
      </div>
    </div>
  )
}