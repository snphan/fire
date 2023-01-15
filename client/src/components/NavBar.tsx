import React from 'react';
import home from '@/icons/home.svg';
import '../App.css';
import { Tooltip, Button } from '@material-tailwind/react';

export function NavBar({ setAppState, endSession, currState }: any) {

  return (
    <nav className="bg-gray-800 drop-shadow-strong w-20 h-screen fixed top-0 left-0 z-20">
      <ul className="flex items-center justify-start flex-col h-full">
        {([
          { name: "space_dashboard", state: "dashboard" },
          { name: "real_estate_agent", state: "prospective-real-estate" }
        ]).map((icon) => (

          <Tooltip key={icon.name} content={icon.state.replaceAll("-", " ")} className="capitalize bg-gray-900 p-2">
            <li onClick={() => setAppState(icon.state)} className={((currState === icon.state) ? "bg-light-blue-500 " : "") + ("cursor-pointer hover:bg-gray-600 rounded-lg flex flex-col justify-center items-center w-14 h-14 m-3")}>
              <span className="text-3xl material-icons material-symbols-outlined">{icon.name}</span>
            </li>
          </Tooltip>
        )

        )}
        <li className="grow"></li>
        <Tooltip content="Logout" className="bg-gray-900 p-2 capitalize">
          <li onClick={() => endSession()} className="cursor-pointer hover:bg-gray-600 rounded-lg flex flex-col justify-center items-center w-14 h-14 m-3">
            <span className="text-3xl material-icons">logout</span>
          </li>
        </Tooltip>
      </ul>
    </nav>
  )
}