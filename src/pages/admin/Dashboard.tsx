import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Video, 
  TrendingUp, 
  Activity,
  History
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    legislations: 0,
    sessions: 0,
    pendingComments: 0,
    totalComments: 0,
    views: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

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
    fetchStats();
    fetchRecentLogs();
  }, [token]);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchRecentLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRecentLogs(data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch recent logs:', err);
    }
  };

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
              <p className="text-sm font-medium text-slate-500">Total Legislation</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">{stats.legislations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-lgu-blue-900">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active records</span>
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
            <span>Recorded sessions</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Comments</p>
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">{stats.pendingComments}</p>
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
              <p className="text-3xl font-bold text-lgu-blue-900 mt-1">{stats.views}</p>
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
            <History className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-6">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-lgu-blue-900 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-bold">{log.user_name}</span> {log.action.toLowerCase()} {log.target_type.toLowerCase()} <span className="italic">{log.details}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/admin/logs" className="block w-full mt-6 py-2 text-center text-sm text-lgu-blue-900 font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            View All Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
