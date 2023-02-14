import React from 'react';
import { REACT_APP_MEDIA_HOST } from '@/config';

export function REListItem({ REInfo, onClick, disabled, className }: any) {
  return (
    <div className={(className ? className + " " : "") + (disabled ? "" : "hover:scale-105 cursor-pointer ") + "flex lg:p-5 rounded-xl m-2 lg:m-5 h-28 max-w-screen lg:h-auto lg:min-h-36 bg-zinc-900 shadow-2xl"}
      onClick={onClick}
    >
      <img className="lg:rounded-xl rounded-l-xl w-28 h-full lg:w-28 lg:h-28" src={`${REACT_APP_MEDIA_HOST}/media/${REInfo.picture_links.length ? REInfo.picture_links[0] : "a04e34f6-85fa-447a-b316-89363851e9c6-fire logo.png"}`} alt="" />
      <div className="m-2 flex flex-col justify-start">
        <h3>${REInfo.purchase_price}</h3>
        <div className="flex mx-2 space-x-2">
          <span className="text-sm lg:text-xl material-icons">bed</span>
          <div className="text-sm lg:text-xl">{REInfo.bedrooms}</div>
          <span className="text-sm lg:text-xl material-icons">bathtub</span>
          <div className="text-sm lg:text-xl">{REInfo.bathrooms}</div>
        </div>
        <h4 className={`truncate lg:whitespace-normal lg:w-auto`}
          style={{ width: (window.screen.width < 1024) ? `calc(${window.screen.width * 0.9}px - 7rem)` : 'auto' }}
        >{REInfo.address}, {REInfo.city}, {REInfo.province}</h4>
      </div>
    </div>
  )
}