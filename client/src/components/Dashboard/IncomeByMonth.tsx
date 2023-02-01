import { MonthYearFormatContext } from "@/Context"
import { useContext, useEffect, useState } from "react"
import React from 'react';
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { fireTheme } from "@/config/echart.config";
import { Tooltip } from "@material-tailwind/react";

echarts.registerTheme('my_theme', fireTheme);

interface IIncome {
  [key: string]: {
    income: number;
    dividend: number;
  }
}

export function IncomeByMonth({ className, allIncome, allDividends }: any) {

  const [incomeData, setIncomeData] = useState<IIncome>({ "1993/01": { income: 0, dividend: 0 } })

  useEffect(() => {
    if (allIncome && allDividends) {
      const today = new Date();
      const dates = allIncome.concat(allDividends).map((item: any) => new Date(item.date))
      const minDate = new Date(Math.min.apply(null, dates))
      const begin = new Date(`${minDate.getFullYear()}/${minDate.getMonth() + 1}`)
      const newIncomeData: IIncome = {};
      for (let now = begin; now < today; now = new Date(now.setMonth(now.getMonth() + 1))) {
        const YYYYMM = `${now.getFullYear()}/${now.getMonth() + 1}`;
        newIncomeData[YYYYMM] = { income: 0, dividend: 0 };
      }
      // Income
      for (const income of allIncome) {
        const date = new Date(income.date);
        const YYYYMM = `${date.getFullYear()}/${date.getMonth() + 1}`;
        console.log(income.amount);
        console.log(YYYYMM);
        console.log(newIncomeData[YYYYMM].income);
        newIncomeData[YYYYMM].income += Math.abs(parseFloat(income.amount));
        newIncomeData[YYYYMM].income = Math.round(newIncomeData[YYYYMM].income * 100) / 100;
      }
      // Dividends
      for (const dividend of allDividends) {
        const date = new Date(dividend.date);
        const YYYYMM = `${date.getFullYear()}/${date.getMonth() + 1}`;
        newIncomeData[YYYYMM].dividend += Math.abs(parseFloat(dividend.amount));
        newIncomeData[YYYYMM].dividend = Math.round(newIncomeData[YYYYMM].dividend * 100) / 100;
        console.log(newIncomeData[YYYYMM])
      }
      setIncomeData(newIncomeData);
    }
  }, [allIncome, allDividends])


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
      text: 'Income History',
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
      data: Object.keys(incomeData)
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '20%']
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
        name: 'Income',
        type: 'bar',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#dce775'
            },
            {
              offset: 1,
              color: '#2e7d32'
            }
          ])
        },
        data: Object.values(incomeData).map((item: any) => item.income)
      },
      {
        name: 'Dividends',
        type: 'bar',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#fff59d'
            },
            {
              offset: 1,
              color: '#ff6f00'
            }
          ])
        },
        data: Object.values(incomeData).map((item: any) => item.dividend)
      }
    ]
  };

  return (
    <Tooltip content={"Income from Accounts + Dividends"} className="capitalize bg-zinc-900 p-2">
      <button className={className}>
        <ReactECharts theme="my_theme" style={{ height: "100%" }} option={option} />
      </button>
    </Tooltip>
  )
}