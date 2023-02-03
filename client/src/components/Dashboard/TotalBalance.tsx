import { CurrencyContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';


export function TotalBalance({ loading, balanceData, className }: any) {

  const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined);
  const currencyFormatter = useContext(CurrencyContext);

  useEffect(() => {
    console.log(balanceData);
    if (balanceData) {
      setTotalBalance(balanceData.getAccounts.accounts.reduce(
        (a: number, b: any) => {
          let total = b.balances.current;
          if (b.balances.iso_currency_code === 'USD') total *= 1.3;
          if (b.type === "credit") total *= -1;
          return a + total;
        }, 0));
    }
  })

  return (

    <button className={className}>
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