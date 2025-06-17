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

interface SalesChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
    }[];
  };
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        bodySpacing: 4,
        boxWidth: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-HN', {
                style: 'currency',
                currency: 'HNL',
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          drawBorder: false,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        }
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 2,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="card h-85">
      <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};