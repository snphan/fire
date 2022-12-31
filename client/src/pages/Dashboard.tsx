import React from 'react';
import { NavBar } from '@/components/NavBar';

export function Dashboard({ setAppState }: any) {
  return (
    <>
      <NavBar setAppState={setAppState} />
      <p>Welcome to the Dashboard</p>
    </>
  )
}