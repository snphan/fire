import React from 'react';
import logo from '@/logo.svg';


export function Loading({ className }: any) {
  return (
    <img src={logo} className={(className ? className + " " : "") + "App-logo !mx-auto"} alt="logo" />
  )
}