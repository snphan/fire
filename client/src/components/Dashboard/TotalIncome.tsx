import { CurrencyContext, MonthYearFormatContext } from '@/Context';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';

export function TotalIncome({ loading, transactions, investTransactions, className }: any) {

  const [income, setIncome] = useState<number>(0);

  const currencyFormatter = useContext(CurrencyContext);
  const monthYearFormatter = useContext(MonthYearFormatContext);


  useEffect(() => {
    let newIncome = 0;
    if (transactions?.getTransactions.length) {
      const incomeTransactions = transactions.getTransactions.filter((item: any) => item.category === "INCOME");
      const incomeAmounts = incomeTransactions.map((item: any) => item.amount);
      newIncome += incomeAmounts.reduce((a: number, b: string) => a + Math.abs(parseFloat(b)), 0);
    }

    if (investTransactions?.getInvestTransactions.length) {
      const investTxnDateFormatted = investTransactions.getInvestTransactions.map((item: any) => ({ ...item, date: dayjs(item.date).format('YYYY/MM') }));
      const investTxnInCurrentMonth = investTxnDateFormatted.filter((item: any) =>
        item.date === dayjs().format("YYYY/MM")
        && item.type === "cash"
        && !item.name.match(/CONTRIBUTION/)
      );
      newIncome += investTxnInCurrentMonth.reduce((a: number, b: any) => a + Math.abs(parseFloat(b.amount)), 0);
    }

    setIncome(newIncome);
  }, [transactions, investTransactions]);

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