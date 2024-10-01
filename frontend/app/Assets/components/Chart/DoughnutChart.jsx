"use client";

import React from 'react';
import styles from './DoughnutChart.module.css';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const DoughnutChart = ({ data, chartTitle = 'Chart.js Doughnut Chart' }) => {
  const defaultData = {
    labels: ['ESGI', 'EPSI', 'CESI', 'PPA'],
    datasets: [
      {
        label: 'Invoices',
        data: [3, 4, 2, 1],
        backgroundColor: ['#AD5FED', '#FFA973', '#73C5FF', '#8BC34A'],
        hoverBackgroundColor: ['#B884FF', '#FFC078', '#8ED6FF', '#9CCC65'],
      },
    ],
  };

  const config = {
    data: data || defaultData,
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: chartTitle,
        },
        datalabels: {
          display: true,
          color: 'white',
          formatter: (value, context) => {
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.doughnut_chart_container}>
      <Doughnut {...config} />
    </div>
  );
};

export default DoughnutChart;
