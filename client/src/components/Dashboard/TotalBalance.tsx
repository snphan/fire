import React from 'react';
import { Loading } from '../Loading';


export function TotalBalance({ loading, totalBalance }: any) {
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return (

    <div className="flex flex-col bg-zinc-900 h-52 p-3 m-4 rounded-xl shadow-xl">
      <div className="text-sm font-bold">Total Balance</div>
      <div className="grow flex justify-center items-center">
        {loading ?
          <Loading className="w-12 h-12"></Loading>
          :
          <div className="text-4xl font-bold text-sky-500">{totalBalance && currencyFormatter.format(totalBalance!)}</div>
        }
      </div>
    </div>
  )
}