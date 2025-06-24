import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const HomeTab = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly'); // weekly, monthly, yearly
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1'];

  useEffect(() => {
    const fetchTrends = async () => {
      const frontend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      
      try {
        setLoading(true);
        let endpoint = '';
        
        // Choose endpoint based on filter
        switch(timeFilter) {
          case 'weekly':
            endpoint = `${frontend}/weekly-trends`;
            break;
          case 'yearly':
            endpoint = `${frontend}/yearly-trends`;
            break;
          case 'monthly':
          default:
            endpoint = `${frontend}/monthly-trends`;
            break;
        }
        
        const res = await fetch(endpoint);
        const data = await res.json();
        
        // Map data based on time filter
        const mapped = data.map(d => ({
          period: d.week || d.month || d.year || d.period,
          recovered: d.recovered || 0,
          affected: d.affected || 0,
          died: d.died || 0,
        }));
        
        setChartData(mapped);
      } catch (error) {
        console.error("Failed to fetch trend data:", error);
        // Sample data for demonstration
        const sampleData = generateSampleData(timeFilter);
        setChartData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [timeFilter]);

  // Generate sample data for demonstration
  const generateSampleData = (filter) => {
    const data = [];
    let periods = [];
    
    switch(filter) {
      case 'weekly':
        periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
        break;
      case 'yearly':
        periods = ['2019', '2020', '2021', '2022', '2023', '2024'];
        break;
      case 'monthly':
      default:
        periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
    }
    
    periods.forEach(period => {
      data.push({
        period,
        recovered: Math.floor(Math.random() * 100) + 50,
        affected: Math.floor(Math.random() * 80) + 20,
        died: Math.floor(Math.random() * 30) + 5,
      });
    });
    
    return data;
  };

  const totalRecovered = chartData.reduce((sum, d) => sum + d.recovered, 0);
  const totalAffected = chartData.reduce((sum, d) => sum + d.affected, 0);
  const totalDied = chartData.reduce((sum, d) => sum + d.died, 0);

  const pieChartData = [
    { name: 'Recovered', value: totalRecovered },
    { name: 'Affected', value: totalAffected },
    { name: 'Died', value: totalDied },
  ];

  const getFilterLabel = () => {
    switch(timeFilter) {
      case 'weekly': return 'Weekly';
      case 'yearly': return 'Yearly';
      case 'monthly': return 'Monthly';
      default: return 'Monthly';
    }
  };

  const getAveragePeriods = () => {
    switch(timeFilter) {
      case 'weekly': return chartData.length || 1;
      case 'yearly': return chartData.length || 1;
      case 'monthly': return chartData.length || 1;
      default: return chartData.length || 1;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Pig Health Monitoring Dashboard
        </h1>
        <p className="text-gray-600">Overview of pig health statistics and trends</p>
      </div>

      {/* Time Filter Controls */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {['weekly', 'monthly', 'yearly'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${
                  timeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Showing {getFilterLabel().toLowerCase()} data ({chartData.length} periods)
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Recovered</h3>
              <p className="text-3xl font-bold text-blue-600">{totalRecovered.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{getFilterLabel()} total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Affected</h3>
              <p className="text-3xl font-bold text-purple-600">{totalAffected.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{getFilterLabel()} total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Died</h3>
              <p className="text-3xl font-bold text-indigo-600">{totalDied.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{getFilterLabel()} total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            {getFilterLabel()} Trends
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="recovered" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                name="Pigs Recovered"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="affected" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                name="Pigs Affected"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="died" 
                stroke="#6366f1" 
                strokeWidth={3} 
                name="Pigs Died"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            {getFilterLabel()} Summary
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent, value }) => {
                  return percent > 0.05 ? `${name}: ${(percent * 100).toFixed(1)}%` : '';
                }}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-6">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span className="text-sm text-gray-600">
                  {entry.name}: {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Key Insights ({getFilterLabel()})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {totalRecovered + totalAffected + totalDied > 0 
                ? ((totalRecovered / (totalRecovered + totalAffected + totalDied)) * 100).toFixed(1)
                : '0.0'
              }%
            </p>
            <p className="text-sm text-gray-600">Recovery Rate</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {totalRecovered + totalAffected + totalDied > 0 
                ? ((totalDied / (totalRecovered + totalAffected + totalDied)) * 100).toFixed(1)
                : '0.0'
              }%
            </p>
            <p className="text-sm text-gray-600">Mortality Rate</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">
              {(totalRecovered + totalAffected + totalDied).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Cases</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-teal-600">
              {Math.round((totalRecovered + totalAffected + totalDied) / getAveragePeriods())}
            </p>
            <p className="text-sm text-gray-600">
              Avg. {getFilterLabel().replace('ly', '')} Cases
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;