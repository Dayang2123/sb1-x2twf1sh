import React, { useState } from 'react';
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
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Mock data for chart
  const labels = timeRange === '7d' 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
    : timeRange === '30d'
    ? Array.from({ length: 30 }, (_, i) => `${i + 1}`)
    : Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
  
  const viewsData = timeRange === '7d'
    ? [120, 190, 210, 250, 230, 295, 310]
    : timeRange === '30d'
    ? Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 100)
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 2000) + 800);
  
  const engagementData = timeRange === '7d'
    ? [20, 45, 37, 52, 48, 65, 74]
    : timeRange === '30d'
    ? Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 20)
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 500) + 200);

  const data = {
    labels,
    datasets: [
      {
        label: 'Views',
        data: viewsData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Engagement',
        data: engagementData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 3,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Content Performance</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '7d' 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            7D
          </button>
          <button 
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '30d' 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            30D
          </button>
          <button 
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${
              timeRange === '90d' 
                ? 'bg-primary-100 text-primary-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            90D
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <p className="text-sm text-primary-600 font-medium">Total Views</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {timeRange === '7d' ? '1,605' : timeRange === '30d' ? '8,423' : '27,945'}
          </p>
          <p className="text-xs text-success-600 font-medium mt-2">
            +{timeRange === '7d' ? '12.5' : timeRange === '30d' ? '8.3' : '15.2'}% vs previous period
          </p>
        </div>
        <div className="bg-secondary-50 rounded-lg p-4">
          <p className="text-sm text-secondary-600 font-medium">Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {timeRange === '7d' ? '21.4' : timeRange === '30d' ? '18.7' : '19.2'}%
          </p>
          <p className="text-xs text-success-600 font-medium mt-2">
            +{timeRange === '7d' ? '3.2' : timeRange === '30d' ? '1.5' : '2.3'}% vs previous period
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;