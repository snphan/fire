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
        <div className="text-sm font-bold">Total {monthYearFormatter.format(new Date())} Income</div>
        <div className="grow flex justify-center items-center w-full">
          {loading ?
            <Loading className="w-12 h-12"></Loading>
            :
            <div className="text-4xl font-bold text-green-400">{typeof income !== "undefined" && currencyFormatter.format(income!)}</div>
          }
        </div>
      </div>
    </button>
  )
}