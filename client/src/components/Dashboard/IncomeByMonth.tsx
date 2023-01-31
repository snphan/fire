import { MonthYearFormatContext } from "@/Context"
import { useContext } from "react"
import React from 'react';
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { fireTheme } from "@/config/echart.config";
import { Tooltip } from "@material-tailwind/react";

echarts.registerTheme('my_theme', fireTheme);

export function IncomeByMonth({ className, allTxn }: any) {
  let base = +new Date(1968, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let date = [];

  let data = [Math.random() * 300];

  for (let i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }
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
      data: date
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
        name: 'Fake Data',
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
        data: data
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