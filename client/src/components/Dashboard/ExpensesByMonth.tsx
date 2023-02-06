import { DashboardContext, MonthYearFormatContext } from "@/Context"
import { memo, useContext, useEffect, useState } from "react"
import React from 'react';
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { fireTheme } from "@/config/echart.config";
import { Tooltip } from "@material-tailwind/react";
import dayjs from "dayjs";

echarts.registerTheme('my_theme', fireTheme);

interface IExpenses {
  [key: string]: {
    expense: number;
  }
}

export const ExpensesByMonth = memo(function ExpensesByMonth({ className, allExpenses, setTxnTableFiltersCallback }: any) {

  const [expenseData, setExpenseData] = useState<IExpenses>({ "1993/01": { expense: 0 } })
  const dashboardContext = useContext(DashboardContext);

  useEffect(() => {
    if (allExpenses()) {
      const today = new Date();
      const dates = allExpenses().map((item: any) => new Date(item.date))
      const minDate = new Date(Math.min.apply(null, dates))
      const begin = new Date(`${minDate.getFullYear()}/${minDate.getMonth() + 1}`)
      const newExpensesData: IExpenses = {};
      for (let now = begin; now < today; now = new Date(now.setMonth(now.getMonth() + 1))) {
        const YYYYMM = `${now.getFullYear()}/${now.getMonth() + 1}`;
        newExpensesData[YYYYMM] = { expense: 0 };
      }
      // Income
      for (const expense of allExpenses()) {
        const date = new Date(expense.date);
        const YYYYMM = `${date.getFullYear()}/${date.getMonth() + 1}`;
        newExpensesData[YYYYMM].expense += Math.abs(parseFloat(expense.amount));
        newExpensesData[YYYYMM].expense = Math.round(newExpensesData[YYYYMM].expense * 100) / 100;
      }
      setExpenseData(newExpensesData);
    }
  }, [allExpenses])


  const option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
      axisPointer: {
        type: 'shadow',
        label: {
          show: true
        }
      }
    },
    title: {
      left: 'left',
      text: 'Expenses History',
      textStyle: {
        fontSize: '0.875rem'
      }
    },
    legend: {
      top: '0%',
      left: 'center'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: ['10%', '10%'],
      data: Object.keys(expenseData)
    },
    yAxis: {
      type: 'value', boundaryGap: [0, '20%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 90,
        end: 100
      },
      {
        start: 90,
        end: 100
      }
    ],
    series: [
      {
        name: 'Expenses',
        type: 'bar',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#f48fb1'
            },
            {
              offset: 1,
              color: '#e91e63'
            }
          ]),
          borderRadius: 5
        },
        data: Object.values(expenseData).map((item: any) => item.expense)
      }
    ]
  };

  //TODO: Handle the click to filter some Transactionson our future Txn table viz.
  const handleChartClick = (e: any) => {
    console.log(setTxnTableFiltersCallback);
    setTxnTableFiltersCallback({
      startDate: dayjs(e.name).format('YYYY-MM-DD'),
      endDate: dayjs(e.name).add(1, 'month').format('YYYY-MM-DD'),
      categories: null,
      notCategories: ['INCOME', 'TRANSFER_IN', 'TRANSFER_OUT', 'LOAN_PAYMENTS']
    })

  }

  return (
    <Tooltip content={"Expenses Excluding Transfers"} className="capitalize bg-zinc-900 p-2">
      <button className={className}>
        <ReactECharts onEvents={{ click: handleChartClick }} theme="my_theme" style={{ height: "100%" }} option={option} />
      </button>
    </Tooltip>
  )
});