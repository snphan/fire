import { CurrencyContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';


export function TotalBalance({ loading, balanceData, className }: any) {

  const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined);
  const currencyFormatter = useContext(CurrencyContext);

  useEffect(() => {
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
        <div className="text-xs lg:text-sm font-bold">Total Balance</div>
        <div className="grow flex justify-center items-center w-full">
          {loading ?
            <Loading className="m-2 w-10 h-10 lg:w-12 lg:h-12" />
            :
            <div className="text-xl lg:text-4xl font-bold text-sky-500">{typeof totalBalance !== undefined && currencyFormatter.format(totalBalance!)}</div>
          }
        </div>
      </div>
    </button>
  )
}