import { MonthYearFormatContext } from "@/Context"
import { useContext, useEffect, useState } from "react"
import React from 'react';
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { fireTheme } from "@/config/echart.config";
import { Tooltip } from "@material-tailwind/react";

echarts.registerTheme('my_theme', fireTheme);

export function IncomeByMonth({ className, allIncome }: any) {

  const [incomeData, setIncomeData] = useState({})

  useEffect(() => {
    if (allIncome) {
      const today = new Date();
      const dates = allIncome.map((item: any) => new Date(item.date))
      const minDate = new Date(Math.min.apply(null, dates))
      const newIncomeData: { [k: string]: number } = {};
      for (let now = minDate; now < today; now = new Date(now.setDate(now.getDate() + 1))) {
        const YYYYMMDD = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
        newIncomeData[YYYYMMDD] = 0;
      }
      for (const income of allIncome) {
        const date = new Date(income.date);
        const YYYYMMDD = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        newIncomeData[YYYYMMDD] = Math.abs(income.amount);
      }
      setIncomeData(newIncomeData);
    }
  }, [allIncome])


  const option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'left',
      text: 'Income History',
      textStyle: {
        fontSize: '0.875rem'
      }
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
      boundaryGap: false,
      data: Object.keys(incomeData)
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
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
        data: Object.values(incomeData)
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