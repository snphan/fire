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