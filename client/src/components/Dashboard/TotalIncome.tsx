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
    <div className="flex flex-col bg-zinc-900 h-52 p-3 m-4 rounded-xl shadow-xl">
      <div className="text-sm font-bold">Total Month Profits</div>
      <div className="grow flex justify-center items-center">
        {loading ?
          <Loading className="w-12 h-12"></Loading>
          :
          <div className="text-4xl font-bold text-green-400">{typeof income !== "undefined" && currencyFormatter.format(income)}</div>
        }
      </div>
    </div>
  )
}