import React from 'react';
import home from '@/icons/home.svg';
import '../App.css';
import { Tooltip, Button } from '@material-tailwind/react';

export function NavBar({ setAppState, endSession }: any) {

  return (
    <nav className="bg-zinc-800 drop-shadow-strong w-20 h-screen fixed top-0 left-0">
      <ul className="flex items-center justify-start flex-col h-full">
        {([
          { name: "space_dashboard", state: "dashboard" },
          { name: "insights", state: "real-estate-tracker" }
        ]).map((icon) => (

          <Tooltip content={icon.state.replaceAll("-", " ")} className="capitalize bg-zinc-900 p-2">
            <li key={icon.name} onClick={() => setAppState(icon.state)} className="cursor-pointer hover:bg-zinc-600 rounded-lg flex flex-col justify-center items-center w-14 h-14 m-3">
              <span className="text-3xl material-icons material-symbols-outlined">{icon.name}</span>
            </li>
          </Tooltip>
        )

        )}
        <li className="grow"></li>
        <Tooltip content="Logout" className="bg-zinc-900 p-2 capitalize">
          <li onClick={() => endSession()} className="cursor-pointer hover:bg-zinc-600 rounded-lg flex flex-col justify-center items-center w-14 h-14 m-3">
            <span className="text-3xl material-icons">logout</span>
          </li>
        </Tooltip>
      </ul>
    </nav>
  )
}