import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, CheckCircle, XCircle, Trash2, Search, Filter, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function Comments() {
  const { token } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [respondingTo, setRespondingTo] = useState<any>(null);
  const [adminResponse, setAdminResponse] = useState('');

  const fetchComments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleUpdateStatus = async (id: string, status: string, response: string = '') => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, admin_response: response })
      });
      if (res.ok) {
        setRespondingTo(null);
        setAdminResponse('');
        fetchComments();
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const filteredComments = comments.filter(c => {
    const matchesSearch = c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Public Comments</h1>
        <p className="text-slate-500">Moderate and respond to citizen feedback on legislations and sessions.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search comments or users..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-slate-400 w-5 h-5" />
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">Loading...</div>
        ) : filteredComments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">No comments found.</div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lgu-blue-900 font-bold mr-3">
                      {comment.user_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{comment.user_name}</h3>
                      <p className="text-xs text-slate-500">
                        {comment.barangay} • {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    comment.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                    comment.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {comment.status}
                  </span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg mb-4 text-slate-700 italic">
                  "{comment.content}"
                </div>

                {comment.admin_response && (
                  <div className="ml-8 mt-4 p-4 bg-lgu-blue-50 border-l-4 border-lgu-blue-900 rounded-r-lg">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="w-4 h-4 text-lgu-blue-900 mr-2" />
                      <span className="text-xs font-bold text-lgu-blue-900 uppercase">Admin Response</span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.admin_response}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-end items-center gap-3 border-t border-slate-100 pt-4">
                  {comment.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(comment.id, 'Approved')}
                        className="flex items-center px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(comment.id, 'Rejected')}
                        className="flex items-center px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setRespondingTo(comment);
                      setAdminResponse(comment.admin_response || '');
                    }}
                    className="flex items-center px-3 py-1.5 text-xs font-bold text-lgu-blue-900 hover:bg-lgu-blue-50 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> {comment.admin_response ? 'Edit Response' : 'Respond'}
                  </button>
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {respondingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Respond to {respondingTo.user_name}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg italic">
                "{respondingTo.content}"
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Response</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900 h-32 resize-none"
                  placeholder="Type your response here..."
                  value={adminResponse}
                  onChange={e => setAdminResponse(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setRespondingTo(null)}
                  className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateStatus(respondingTo.id, respondingTo.status === 'Pending' ? 'Approved' : respondingTo.status, adminResponse)}
                  className="px-6 py-2 bg-lgu-blue-900 text-white rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors"
                >
                  Save & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
