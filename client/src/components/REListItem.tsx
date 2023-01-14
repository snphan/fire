import React from 'react';
import { REACT_APP_MEDIA_HOST } from '@/config';

export function REListItem({ REInfo, onClick, disabled, className }: any) {
  return (
    <div className={(className ? className + " " : "") + (disabled ? "" : "hover:scale-105 cursor-pointer ") + "flex p-5 rounded-xl mx-5 my-5 min-h-36 bg-gray-800 shadow-2xl"}
      onClick={onClick}
    >
      <img className="rounded-xl w-28 h-28" src={`${REACT_APP_MEDIA_HOST}/media/${REInfo.picture_links.length ? REInfo.picture_links[0] : "a04e34f6-85fa-447a-b316-89363851e9c6-fire logo.png"}`} alt="" />
      <div className="m-2 flex flex-col justify-start">
        <h3>${REInfo.purchase_price}</h3>
        <div className="flex mx-2 space-x-2">
          <span className="material-icons">bed</span>
          <div>{REInfo.bedrooms}</div>
          <span className="material-icons">bathtub</span>
          <div>{REInfo.bathrooms}</div>
        </div>
        <h4>{REInfo.address}, {REInfo.city}, {REInfo.province}</h4>
      </div>
    </div>
  )
}