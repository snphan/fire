import { DashboardContext, MonthYearFormatContext } from "@/Context"
import { memo, useContext, useEffect, useState } from "react"
import React from 'react';
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { fireTheme } from "@/config/echart.config";
import { Tooltip } from "@material-tailwind/react";
import dayjs from "dayjs";

echarts.registerTheme('my_theme', fireTheme);

interface IIncome {
  [key: string]: {
    income: number;
    dividend: number;
  }
}

export const IncomeByMonth = memo(function IncomeByMonth({ className, allIncome, allDividends, setTxnTableFiltersCallback, openTxnTable }: any) {

  const [incomeData, setIncomeData] = useState<IIncome>({ "1993/01": { income: 0, dividend: 0 } })

  useEffect(() => {
    if (allIncome() && allDividends()) {
      const today = dayjs(dayjs().format("YYYY/MM")).add(1, 'month');
      const dates = allIncome().concat(allDividends()).map((item: any) => new Date(item.date))
      const minDate = dayjs(dayjs(Math.min.apply(null, dates)).format('YYYY/MM'));

      const newIncomeData: IIncome = {};
      for (let now = minDate; now.isBefore(today); now = now.add(1, 'month')) {
        const YYYYMM = now.format("YYYY/MM");
        newIncomeData[YYYYMM] = { income: 0, dividend: 0 };
      }
      // Income
      for (const income of allIncome()) {
        const { date } = income;
        const YYYYMM = dayjs(date).format('YYYY/MM');
        newIncomeData[YYYYMM].income += Math.abs(parseFloat(income.amount));
        newIncomeData[YYYYMM].income = Math.round(newIncomeData[YYYYMM].income * 100) / 100;
      }
      // Dividends
      for (const dividend of allDividends()) {
        const { date } = dividend;
        const YYYYMM = dayjs(date).format('YYYY/MM');
        newIncomeData[YYYYMM].dividend += Math.abs(parseFloat(dividend.amount)); newIncomeData[YYYYMM].dividend = Math.round(newIncomeData[YYYYMM].dividend * 100) / 100;
      } setIncomeData(newIncomeData);
    }
  }, [allIncome, allDividends])


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
      text: 'Income History',
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
      data: Object.keys(incomeData),
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
            },
          ]),
          borderRadius: 5
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
          ]),
          borderRadius: 5
        },
        data: Object.values(incomeData).map((item: any) => item.dividend)
      }
    ]
  };

  //TODO: Handle the click to filter some Transactionson our future Txn table viz.
  const handleChartClick = (e: any) => {
    setTxnTableFiltersCallback({
      startDate: dayjs(e.name).format('YYYY-MM-DD'),
      endDate: dayjs(e.name).add(1, 'month').format('YYYY-MM-DD'),
      categories: ['INCOME', 'DIVIDENDS'],
      notCategories: null
    })
    openTxnTable();
  }

  return (
    <Tooltip content={"Income from Accounts + Dividends"} className="capitalize bg-zinc-900 p-2">
      <button className={className}>
        <ReactECharts
          className=""
          onEvents={{ click: handleChartClick }}
          theme="my_theme" style={{ height: "100%" }}
          option={option}
        />
      </button>
    </Tooltip>
  )
});