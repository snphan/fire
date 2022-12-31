import React from 'react';
import { NavBar } from '@/components/NavBar'


export function RealEstateTracker({ setAppState }: any) {
  return (
    <>
      <NavBar setAppState></NavBar>
      <p>Welcome to the Real Estate Tracker</p>
    </>
  )
}