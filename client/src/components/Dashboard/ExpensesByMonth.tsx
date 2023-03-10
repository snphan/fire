import { memo, useEffect, useState } from "react"
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

export const ExpensesByMonth = memo(function ExpensesByMonth({ className, allExpenses, setTxnTableFiltersCallback, openTxnTable }: any) {

  const [expenseData, setExpenseData] = useState<IExpenses>({ "1993/01": { expense: 0 } })

  useEffect(() => {
    if (allExpenses()) {
      const today = dayjs(dayjs().format("YYYY/MM")).add(1, 'month');
      const dates = allExpenses().map((item: any) => new Date(item.date))
      const minDate = dayjs(dayjs(Math.min.apply(null, dates)).format('YYYY/MM'));

      const newExpensesData: IExpenses = {};
      for (let now = minDate; now.isBefore(today); now = now.add(1, 'month')) {
        const YYYYMM = now.format("YYYY/MM");
        newExpensesData[YYYYMM] = { expense: 0 };
      }

      // Expense
      for (const expense of allExpenses()) {
        const { date } = expense;
        const YYYYMM = dayjs(date.split("T")[0]).format('YYYY/MM');
        newExpensesData[YYYYMM].expense += parseFloat(expense.amount);
        newExpensesData[YYYYMM].expense = Math.round(newExpensesData[YYYYMM].expense * 100) / 100;
      }
      setExpenseData(newExpensesData);
    }
  }, [allExpenses])


  const option = {
    tooltip: (window.screen.width > 1024) ? { // lg screen breakpoint, tooltip was increasing width
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
    } : undefined,
    title: {
      left: 'left',
      text: 'Expense History',
      textStyle: {
        fontSize: (window.screen.width > 1024) ? '0.875rem' : '0.75rem'
      }
    },
    textStyle: {
      fontSize: (window.screen.width > 1024) ? '0.875rem' : '0.75rem'
    },
    legend: {
      top: (window.screen.width > 1024) ? '0%' : '10%',
      left: (window.screen.width > 1024) ? 'center' : 'left',
      itemWidth: (window.screen.width > 1024) ? 25 : 18,
      itemHeight: (window.screen.width > 1024) ? 14 : 10
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      },
      itemSize: (window.screen.width > 1024) ? 15 : 12
    },
    xAxis: {
      type: 'category',
      boundaryGap: ['10%', '10%'],
      data: Object.keys(expenseData),
      axisLabel: {
        fontSize: (window.screen.width > 1024) ? 12 : 9
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '20%'],
      axisLabel: {
        fontSize: (window.screen.width > 1024) ? 12 : 9
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 80,
        end: 100
      },
      {
        start: 80,
        end: 100,
        textStyle: {
          fontSize: (window.screen.width > 1024) ? 12 : 9
        },
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
    setTxnTableFiltersCallback({
      startDate: dayjs(e.name).format('YYYY-MM-DD'),
      endDate: dayjs(e.name).add(1, 'month').format('YYYY-MM-DD'),
      categories: null,
      notCategories: ['INCOME', 'TRANSFER_IN']
    })
    openTxnTable();
  }

  return (
    <Tooltip content={"Expenses Excluding Transfers"} className="capitalize bg-zinc-900 p-2">
      <button className={className}>
        <ReactECharts onEvents={{ click: handleChartClick }} theme="my_theme" style={{ height: "100%" }} option={option} />
      </button>
    </Tooltip>
  )
});