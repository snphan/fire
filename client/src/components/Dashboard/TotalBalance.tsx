import { CurrencyContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';


export function TotalBalance({ loading, balanceData }: any) {

  const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined);
  const currencyFormatter = useContext(CurrencyContext);

  useEffect(() => {
    if (balanceData) {
      setTotalBalance(balanceData.getBalance.balance.reduce(
        (a: number, b: any) => {
          if (b.balances.iso_currency_code === 'USD') {
            return a + b.balances.current * 1.3;
          } else {
            return a + b.balances.current;
          }
        }, 0));
    }
  })

  return (

    <button className="focus:ring focus:ring-blue-300 transition-all bg-zinc-900 h-64 p-3 m-4 rounded-xl shadow-xl">
      <div className="flex flex-col h-full items-start">
        <div className="text-sm font-bold">Total Balance</div>
        <div className="grow flex justify-center items-center w-full">
          {loading ?
            <Loading className="w-12 h-12"></Loading>
            :
            <div className="text-4xl font-bold text-sky-500">{typeof totalBalance !== undefined && currencyFormatter.format(totalBalance!)}</div>
          }
        </div>
      </div>
    </button>
  )
}