import { CurrencyContext } from '@/Context';
import React, { useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { fireTheme } from '@/config/echart.config';
import { number } from 'echarts/core';


echarts.registerTheme('my_theme', fireTheme);
const CADFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

interface Expenses {
  travel: number;
  food_and_drink: number;
  bank_fees: number;
  entertainment: number;
  general_merchandise: number;
  general_services: number;
  government: number;
  home_improvement: number;
  loan_payments: number;
  medical: number;
  personal_care: number;
  rent_and_utilities: number;
  transportation: number;

}

export function ExpensesBreakdown({ loading, transactions, className }: any) {

  const [expenses, setExpenses] = useState<Expenses>({
    travel: 0,
    food_and_drink: 0,
    bank_fees: 0,
    entertainment: 0,
    general_merchandise: 0,
    general_services: 0,
    government: 0,
    home_improvement: 0,
    loan_payments: 0,
    medical: 0,
    personal_care: 0,
    rent_and_utilities: 0,
    transportation: 0
  });

  const totalExpenseForCategory = (CATEGORY: string) => {
    const filteredTransactions = transactions.syncTransactions.added.filter((item: any) => item.personal_finance_category.primary === CATEGORY);
    return filteredTransactions.reduce((a: number, b: any) => a + b.amount, 0)
  }

  const currencyFormatter = useContext(CurrencyContext);
  useEffect(() => {
    if (transactions) {
      const calculateExpenses = {
        travel: totalExpenseForCategory("TRAVEL"),
        food_and_drink: totalExpenseForCategory("FOOD_AND_DRINK"),
        bank_fees: totalExpenseForCategory("BANK_FEES"),
        entertainment: totalExpenseForCategory("ENTERTAINMENT"),
        general_merchandise: totalExpenseForCategory("GENERAL_MERCHANDISE"),
        general_services: totalExpenseForCategory("GENERAL_SERVICES"),
        government: totalExpenseForCategory("GOVERNMENT_AND_NON_PROFIT"),
        home_improvement: totalExpenseForCategory("HOME_IMPROVEMENT"),
        loan_payments: totalExpenseForCategory("LOAN_PAYMENTS"),
        medical: totalExpenseForCategory("MEDICAL"),
        personal_care: totalExpenseForCategory("PERSONAL_CARE"),
        rent_and_utilities: totalExpenseForCategory("RENT_AND_UTILITIES"),
        transportation: totalExpenseForCategory("TRANSPORTATION")
      }

      setExpenses(calculateExpenses);
    }
  }, [transactions]);

  const expensesOptions = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: Object.entries(expenses).map((keyValue: any) => {
          const key = keyValue[0];
          const formattedKey = key.split('_').map((substring: string) => substring[0].toUpperCase() + substring.slice(1)).join(" ");
          const value = keyValue[1];
          if (value) {
            return { value: parseInt(value), name: formattedKey };
          } else {
            return null;
          }
        }).filter((item: any) => item !== null)
      }
    ]
  }

  return (
    <div className={(className ? className : "") + " flex flex-col bg-zinc-900 h-96 p-3 m-4 rounded-xl shadow-xl"}>
      <div className="text-sm font-bold">Total Month Expenses</div>
      {loading ?
        <Loading className="w-12 h-12"></Loading>
        :
        <>
          <div className="flex justify-center">
            <div className="text-4xl font-bold text-pink-400 mt-4">
              {currencyFormatter.format(Object.entries(expenses).reduce((a: number, keyValue: any) => a - Math.abs(keyValue[1]), 0))}
            </div>
          </div>
          <ReactECharts theme="my_theme" style={{ height: "100%" }} option={expensesOptions} />
        </>
      }
    </div>
  )
}