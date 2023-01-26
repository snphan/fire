import { CurrencyContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';

export function TotalIncome({ loading, transactions }: any) {

  const [income, setIncome] = useState<number>(0);

  const currencyFormatter = useContext(CurrencyContext);
  useEffect(() => {
    if (transactions) {
      console.log(transactions);
      const incomeTransactions = transactions.getTransactions.added.filter((item: any) => item.personal_finance_category.primary === "INCOME");
      console.log(incomeTransactions);
      const incomeAmounts = incomeTransactions.map((item: any) => item.amount);
      setIncome(incomeAmounts.reduce((a: number, b: number) => a + b, 0));
    }
  }, [transactions]);

  return (
    <button className="focus:ring focus:ring-blue-300 transition-all bg-zinc-900 h-64 p-3 m-4 rounded-xl shadow-xl">
      <div className="flex flex-col h-full items-start">
        <div className="text-sm font-bold">Total Month Income</div>
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