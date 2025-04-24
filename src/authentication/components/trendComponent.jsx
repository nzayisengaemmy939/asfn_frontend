import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";


const TrendComponent = () => {
    const caseTrends = [
        { month: "Jan", cases: 20 },
        { month: "Feb", cases: 35 },
        { month: "Mar", cases: 50 },
        { month: "Apr", cases: 25 },
      ];
  return (
    <div>
       <div className="bg-white p-4 rounded-xl">
            <div className="bg-white p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Monthly Case Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={caseTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
    </div>
  )
}

export default TrendComponent
