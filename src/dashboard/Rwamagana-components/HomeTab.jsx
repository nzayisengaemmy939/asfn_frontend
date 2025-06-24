import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const HomeTab = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(lineChartData,'line chart data')

  const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1'];

  useEffect(() => {
    const fetchTrends = async () => {
          const frontend = import.meta.env.VITE_BACKEND_URL;
      try {
        const res = await fetch(`${frontend}/monthly-trends`);
        const data = await res.json();
        const mapped = data.map(d => ({
          month: d.month,
          recovered: d.recovered,
          affected: d.affected,
          died: d.died,
        }));
        setLineChartData(mapped);
      } catch (error) {
        console.error("Failed to fetch trend data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const totalRecovered = lineChartData.reduce((sum, d) => sum + d.recovered, 0);
  const totalAffected = lineChartData.reduce((sum, d) => sum + d.affected, 0);
  const totalDied = lineChartData.reduce((sum, d) => sum + d.died, 0);

  const pieChartData = [
    { name: 'Recovered', value: totalRecovered },
    { name: 'Affected', value: totalAffected },
    { name: 'Died', value: totalDied },
  ];

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Recovered */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Recovered</h3>
              <p className="text-3xl font-bold text-blue-600">{totalRecovered.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Affected */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Affected</h3>
              <p className="text-3xl font-bold text-purple-600">{totalAffected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Died */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">Total Died</h3>
              <p className="text-3xl font-bold text-indigo-600">{totalDied.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="recovered" stroke="#3b82f6" strokeWidth={3} name="Pigs Recovered" />
              <Line type="monotone" dataKey="affected" stroke="#8b5cf6" strokeWidth={3} name="Pigs Affected" />
              <Line type="monotone" dataKey="died" stroke="#6366f1" strokeWidth={3} name="Pigs Died" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Overall Summary</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent, value }) => {
                  // Only show label if percentage is above 5% to avoid collision
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
                <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {((totalRecovered / (totalRecovered + totalAffected + totalDied)) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Recovery Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {((totalDied / (totalRecovered + totalAffected + totalDied)) * 100).toFixed(1)}%
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
              {Math.round((totalRecovered + totalAffected + totalDied) / 6)}
            </p>
            <p className="text-sm text-gray-600">Avg. Monthly Cases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;