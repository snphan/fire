import { CurrencyContext, MonthYearFormatContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';

export function TotalIncome({ loading, transactions, className }: any) {

  const [income, setIncome] = useState<number>(0);

  const currencyFormatter = useContext(CurrencyContext);
  const monthYearFormatter = useContext(MonthYearFormatContext);


  useEffect(() => {
    if (transactions?.getTransactions.length) {
      const incomeTransactions = transactions.getTransactions.filter((item: any) => item.category === "INCOME");
      const incomeAmounts = incomeTransactions.map((item: any) => item.amount);
      setIncome(incomeAmounts.reduce((a: number, b: string) => a + Math.abs(parseFloat(b)), 0));
    }
  }, [transactions]);

  //DEBUG 
  useEffect(() => {
  }, [income]);

  return (
    <button className={className}>
      <div className="flex flex-col h-full items-start">
        <div className="text-xs lg:text-sm font-bold">Total {monthYearFormatter.format(new Date())} Income</div>
        <div className="grow flex justify-center items-center w-full">
          {loading ?
            <Loading className="m-2 w-10 h-10 lg:w-12 lg:h-12" />
            :
            <div className="text-xl lg:text-4xl font-bold text-green-400">{typeof income !== "undefined" && currencyFormatter.format(income!)}</div>
          }
        </div>
      </div>
    </button>
  )
}