import React, { useEffect, useState } from "react";
import {
  FaQrcode,
  FaLink,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_urls: 0,
    phishing_urls: 0,
    safe_urls: 0,
    total_qrs: 0,
    phishing_qrs: 0,
    safe_qrs: 0,
  });

  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    const fetchScans = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/recent-scans");
        const scans = await res.json();
        setRecentScans(scans);
      } catch (err) {
        console.error("Failed to fetch recent scans", err);
      }
    };

    fetchStats();
    fetchScans();
  }, []);

  const pieData = [
    { name: "Phishing", value: stats.phishing_urls },
    { name: "Legitimate", value: stats.safe_urls },
  ];

  const qrPieData = [
    { name: "Phishy QR", value: stats.phishing_qrs },
    { name: "Safe QR", value: stats.safe_qrs },
  ];

  const barData = [
    { type: "URL", count: stats.total_urls },
    { type: "QR", count: stats.total_qrs },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">CyberGuard Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total URLs Scanned",
            icon: <FaLink className="text-blue-400 text-2xl" />,
            count: stats.total_urls,
          },
          {
            title: "Phishing Detected",
            icon: <FaExclamationTriangle className="text-red-400 text-2xl" />,
            count: stats.phishing_urls,
          },
          {
            title: "Safe URLs",
            icon: <FaCheckCircle className="text-green-500 text-2xl" />,
            count: stats.safe_urls,
          },
          {
            title: "QR Codes Scanned",
            icon: <FaQrcode className="text-green-400 text-2xl" />,
            count: stats.total_qrs,
          },
          {
            title: "Phishy QR Codes",
            icon: <FaExclamationTriangle className="text-red-400 text-2xl" />,
            count: stats.phishing_qrs,
          },
          {
            title: "Safe QR Codes",
            icon: <FaCheckCircle className="text-green-400 text-2xl" />,
            count: stats.safe_qrs,
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-[#1e293b] p-5 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-blue-500/40 transition"
          >
            {card.icon}
            <div>
              <h4 className="text-sm text-gray-400">{card.title}</h4>
              <p className="text-xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Pie Chart */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">Phishing vs Legitimate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* QR Pie Chart */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">QR Code Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qrPieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                dataKey="value"
              >
                {qrPieData.map((entry, index) => (
                  <Cell key={`cell-qr-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">Scan Type Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="type" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-[#1e293b] p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-300">Recent Scans</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#111827] text-gray-400">
                <th className="text-left py-2 px-4">Type</th>
                <th className="text-left py-2 px-4">Content</th>
                <th className="text-left py-2 px-4">Verdict</th>
                <th className="text-left py-2 px-4">Phishing Probability</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-700 hover:bg-[#2d3748]">
                  <td className="py-2 px-4">{item.type}</td>
                  <td className="py-2 px-4">{item.content}</td>
                  <td className={`py-2 px-4 ${item.verdict === "Legitimate" ? "text-green-400" : "text-red-400"}`}>
                    {item.verdict}
                  </td>
                  <td className="py-2 px-4">{item.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;