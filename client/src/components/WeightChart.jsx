import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function WeightChart({ weightEntries }) {
  if (!weightEntries || weightEntries.length === 0) {
    return (
      <div className="no-data-chart">
        <p>No weight data available</p>
      </div>
    );
  }

  const data = {
    labels: weightEntries.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: weightEntries.map(entry => entry.weight),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3498db',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.raw} lbs`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        beginAtZero: false
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default WeightChart;