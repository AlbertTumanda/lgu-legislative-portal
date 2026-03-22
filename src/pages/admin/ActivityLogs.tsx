import { useState, useEffect, useCallback } from 'react';
import { User, Tag, Clock, Info, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function ActivityLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.target_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Added': return 'text-green-600 bg-green-50';
      case 'Edited': return 'text-blue-600 bg-blue-50';
      case 'Deleted': return 'text-red-600 bg-red-50';
      case 'Moderated': return 'text-purple-600 bg-purple-50';
      case 'Changed Password': return 'text-orange-600 bg-orange-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Activity Logs</h1>
        <p className="text-slate-500">Track administrative actions and system changes.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search logs, users, or details..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400 w-5 h-5" />
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="All">All Actions</option>
            <option value="Added">Added</option>
            <option value="Edited">Edited</option>
            <option value="Deleted">Deleted</option>
            <option value="Moderated">Moderated</option>
            <option value="Changed Password">Changed Password</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading activity logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No activity logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{log.user_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600">
                        <Tag className="w-3 h-3 mr-1" />
                        {log.target_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-slate-600 max-w-xs truncate" title={log.details}>
                        <Info className="w-3 h-3 mr-1 mt-1 flex-shrink-0" />
                        {log.details || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
