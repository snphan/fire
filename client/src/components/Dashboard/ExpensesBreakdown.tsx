import { CurrencyContext, MonthYearFormatContext } from '@/Context';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Loading } from '../Loading';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { fireTheme } from '@/config/echart.config';
import dayjs from 'dayjs';


echarts.registerTheme('my_theme', fireTheme);

interface Expenses {
  travel: number;
  food_and_drink: number;
  bank_fees: number;
  entertainment: number;
  general_merchandise: number;
  general_services: number;
  government_and_non_profit: number;
  home_improvement: number;
  medical: number;
  personal_care: number;
  rent_and_utilities: number;
  transportation: number;
  transfer_out: number;
}

export const ExpensesBreakdown = memo(function ExpensesBreakdown({ loading, transactions, className, setTxnTableFiltersCallback, openTxnTable }: any) {

  const monthYearFormatter = useContext(MonthYearFormatContext);

  const [expenses, setExpenses] = useState<Expenses>({
    travel: 0,
    food_and_drink: 0,
    bank_fees: 0,
    entertainment: 0,
    general_merchandise: 0,
    general_services: 0,
    government_and_non_profit: 0,
    home_improvement: 0,
    medical: 0,
    personal_care: 0,
    rent_and_utilities: 0,
    transportation: 0,
    transfer_out: 0
  });

  const totalExpenseForCategory = (CATEGORY: string) => {
    const filteredTransactions = transactions().filter((item: any) => item.category === CATEGORY);
    return filteredTransactions.reduce((a: number, b: any) => a + parseFloat(b.amount), 0)
  }
  const currencyFormatter = useContext(CurrencyContext);

  useEffect(() => {
    if (transactions()) {
      const calculateExpenses = {
        travel: totalExpenseForCategory("TRAVEL"),
        food_and_drink: totalExpenseForCategory("FOOD_AND_DRINK"),
        bank_fees: totalExpenseForCategory("BANK_FEES"),
        entertainment: totalExpenseForCategory("ENTERTAINMENT"),
        general_merchandise: totalExpenseForCategory("GENERAL_MERCHANDISE"),
        general_services: totalExpenseForCategory("GENERAL_SERVICES"),
        government_and_non_profit: totalExpenseForCategory("GOVERNMENT_AND_NON_PROFIT"),
        home_improvement: totalExpenseForCategory("HOME_IMPROVEMENT"),
        medical: totalExpenseForCategory("MEDICAL"),
        personal_care: totalExpenseForCategory("PERSONAL_CARE"),
        rent_and_utilities: totalExpenseForCategory("RENT_AND_UTILITIES"),
        transportation: totalExpenseForCategory("TRANSPORTATION"),
        transfer_out: totalExpenseForCategory("TRANSFER_OUT")
      }

      setExpenses(calculateExpenses);
    }
  }, [transactions]);

  const expensesOptions = {
    tooltip: (window.screen.width > 1024) ? {// lg screen breakpoint, tooltip was increasing width
      trigger: 'item'
    } : undefined,
    legend: {
      top: '0%',
      left: 'center'
    },
    graphic: {
      elements: [
        {
          type: "group",
          onclick: (e: any) => { console.log(e) }
        }
      ]
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        top: '10%',
        bottom: '-10%',
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
            fontSize: '1rem',
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

  //TODO: Handle the click to filter some Transactionson our future Txn table viz.
  const handleChartClick = (e: any) => {
    const category = e.name.split(" ").join("_").toUpperCase();
    setTxnTableFiltersCallback({
      startDate: dayjs().format('YYYY-MM'),
      endDate: dayjs().add(1, 'month').format('YYYY-MM'),
      categories: [category],
      notCategories: null,
    })
    openTxnTable();
  }

  return (
    <div className={className}>
      <div className="lg:w-full flex justify-between">
        <div className="text-xs lg:text-sm font-bold">Total {monthYearFormatter.format(new Date())} Expenses</div>
        <div className="lg:hidden text-lg lg:text-4xl font-bold text-pink-400 lg:my-5">
          {currencyFormatter.format(Object.entries(expenses).reduce((a: number, keyValue: any) => a - keyValue[1], 0))}
        </div>
      </div>
      {loading ?
        <Loading className="w-12 h-12"></Loading>
        :
        <>
          <div className="flex justify-center">
            <div className="hidden lg:block text-lg lg:text-4xl font-bold text-pink-400 lg:my-5">
              {currencyFormatter.format(Object.entries(expenses).reduce((a: number, keyValue: any) => a - keyValue[1], 0))}
            </div>
          </div>
          <ReactECharts onEvents={{ click: handleChartClick }} theme="my_theme" style={{ height: "100%" }} option={expensesOptions} />
        </>
      }
    </div>
  )
})