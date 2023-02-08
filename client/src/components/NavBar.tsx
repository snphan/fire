import React, { useState } from 'react';
import home from '@/icons/home.svg';
import '../App.css';
import { Tooltip, Button } from '@material-tailwind/react';

export function NavBar({ setAppState, endSession, currState }: any) {

  const [hideNavBar, setHideNavBar] = useState<boolean>(true);

  return (
    <>
      <button className="fixed top-0 left-0 m-5 lg:hidden text-lg z-50 transition-all flex justify-center items-center" onClick={() => setHideNavBar(!hideNavBar)}>
        <span className={"material-icons bg-zinc-800 fixed transition-all " + (hideNavBar ? "opacity-100" : "opacity-0")}>menu</span>
        <span className="material-icons">close</span>
      </button>
      <nav className={(hideNavBar ? "opacity-0 -z-10 " : "opacity-100 z-40 ")
        + "bg-zinc-900 drop-shadow-strong fixed w-screen h-screen transition-all duration-300"
        + " lg:top-0 lg:left-0 lg:z-20 lg:block lg:w-20 lg:opacity-100"
      }>
        <ul className={"flex justify-start h-full flex-col"
          + " lg:items-center"
        }>
          <li className="h-14 lg:hidden"></li>
          {([
            { name: "space_dashboard", state: "dashboard" },
            { name: "real_estate_agent", state: "prospective-real-estate" }
          ]).map((icon) => (
            <Tooltip key={icon.name} content={icon.state.replaceAll("-", " ")} className="capitalize bg-gray-900 p-2">
              <li onClick={() => setAppState(icon.state)} className={((currState === icon.state) ? "bg-light-blue-500 " : "") + ("cursor-pointer hover:bg-zinc-800 rounded-lg flex justify-start lg:justify-center items-center lg:w-14 h-14 m-3")}>
                <span className="text-3xl material-icons material-symbols-outlined mx-3">{icon.name}</span>
                <div className="lg:hidden text-zinc-200 mx-3">{icon.state.split("-").map((sub: string) => sub[0].toUpperCase() + sub.slice(1).toLowerCase()).join(" ")}</div>
              </li>
            </Tooltip>
          )

          )}
          <li className="grow"></li>
          <Tooltip content="Logout" className="bg-gray-900 p-2 capitalize">
            <li onClick={() => endSession()} className="cursor-pointer hover:bg-zinc-800 rounded-lg flex justify-start lg:justify-center items-center lg:w-14 h-14 m-3">
              <span className="text-3xl material-icons mx-3">logout</span>
              <div className="lg:hidden text-zinc-200 mx-3">Logout</div>
            </li>
          </Tooltip>
        </ul>
      </nav>
    </>
  )
}