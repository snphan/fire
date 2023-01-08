import React from 'react';
import { REACT_APP_MEDIA_HOST } from '@/config';

export function REListItem({ REInfo }: any) {
  console.log(process.env);
  return (
    <div className="hover:scale-105 cursor-pointer flex items-center p-5 rounded-xl mx-10 my-10 min-h-36 bg-zinc-800 shadow-2xl">
      <img className="rounded-xl w-28 h-28" src={`${REACT_APP_MEDIA_HOST}/media/a04e34f6-85fa-447a-b316-89363851e9c6-fire logo.png`} alt="" />
      <div className="m-2 flex flex-col justify-start">
        <h3>${REInfo.purchase_price}</h3>
        <h4>{REInfo.address}, {REInfo.city}, {REInfo.province}</h4>
      </div>
    </div>
  )
}