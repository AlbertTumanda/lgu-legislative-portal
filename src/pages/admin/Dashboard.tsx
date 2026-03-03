import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Video, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ordinances: 0,
    sessions: 0,
    comments: 0,
    views: 0
  });

  // Mock Data for Charts
  const engagementData = [
    { name: 'Jan', comments: 40, views: 240 },
    { name: 'Feb', comments: 30, views: 139 },
    { name: 'Mar', comments: 20, views: 980 },
    { name: 'Apr', comments: 27, views: 390 },
    { name: 'May', comments: 18, views: 480 },
    { name: 'Jun', comments: 23, views: 380 },
  ];

  useEffect(() => {
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        ordinances: 124,
        sessions: 45,
        comments: 89,
        views: 12500
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Ordinances</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">{stats.ordinances}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-lgu-blue-900">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+4 this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sessions</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">{stats.sessions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Video className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>Next session in 3 days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Comments</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-500 font-medium">
            <Activity className="w-4 h-4 mr-1" />
            <span>Action required</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Page Views</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">12.5k</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12% vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Public Engagement Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#0f172a" name="Page Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#eab308" name="Comments" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-lgu-blue-900 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-bold">Juan Dela Cruz</span> submitted a comment on <span className="italic">Ordinance No. 2024-001</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-lgu-blue-900 font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}
