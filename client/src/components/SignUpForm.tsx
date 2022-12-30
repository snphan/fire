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
}

export function SignUpForm({ user, goBackToLogin, setUserJustRegistered }: any) {

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: user.email,
    last_name: user.family_name,
    first_name: user.given_name,
    password: "",
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

    /* Singup using only the unique information from google */
    userInfo.password = user.sub;

    console.log(userInfo);

    createUser({ variables: { userData: userInfo } });
    goBackToLogin();
    setUserJustRegistered(true);
  }

  return (
    <div className="w-full max-w-lg">
      <p className="text-xl m-3">It doesn't seem like you are registered... Please Sign Up</p>
      <div className="flex flex-wrap -mx-3 mb-6">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="Email">Email</label>
        <input className="appearance-none block w-full text-lg bg-gray-200 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="text" name="" id="Email" value={userInfo.email} onChange={(e) => setUserInfo(({ ...userInfo, email: e.target.value }))} />
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="last-name">Last Name</label>
        <input className="appearance-none block w-full text-lg bg-gray-200 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="text" name="" id="last-name" value={userInfo.last_name} onChange={(e) => setUserInfo(({ ...userInfo, last_name: e.target.value }))} />
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="first-name">First Name</label>
        <input className="appearance-none block w-full text-lg bg-gray-200 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          type="text" name="" id="first-name" value={userInfo.first_name} onChange={(e) => setUserInfo(({ ...userInfo, first_name: e.target.value }))} />
      </div>

      <div>
        <button className="w-32 bg-transparent border-blue-500 border hover:bg-blue-500 m-5 text-white text-lg font-bold py-2 px-4 rounded-full"
          onClick={() => goBackToLogin()}>Back</button>
        <button className="w-32 bg-blue-500 hover:bg-blue-700 m-5 text-white text-lg font-bold py-2 px-4 rounded-full"
          onClick={() => handleRegister()}>Register</button>
      </div>
    </div>
  )
}