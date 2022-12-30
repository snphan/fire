import { useState } from "react"
import "../App.css"

interface UserInfo {
  email: string,
  last_name: string,
  first_name: string,
}

export function SignUpForm({ user, goBackToLogin }: any) {

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: user.email,
    last_name: user.family_name,
    first_name: user.given_name
  })

  const handleRegister = () => {
    console.log("Registered!");
  }

  return (
    <div className="container-center">
      <p>Please Sign Up</p>
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

      <div>
        <button onClick={() => goBackToLogin()}>Back</button>
        <button onClick={() => handleRegister()}>Register</button>
      </div>
    </div>
  )
}