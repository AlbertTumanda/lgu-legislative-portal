import { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Search, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export default function MessageManagement() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const fetchMessages = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.full_name.toLowerCase().includes(search.toLowerCase()) || 
                         m.subject.toLowerCase().includes(search.toLowerCase()) ||
                         m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-lgu-blue-900">Contact Messages</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-lgu-blue-900"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="flex-grow px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-lgu-blue-900 bg-white"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Replied">Replied</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No messages found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'Unread') handleUpdateStatus(msg.id, 'Read');
                    }}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-1 ${selectedMessage?.id === msg.id ? 'bg-lgu-blue-50 border-l-4 border-lgu-blue-900' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-sm truncate pr-2">{msg.full_name}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{format(new Date(msg.created_at), 'MMM d')}</span>
                    </div>
                    <span className="text-xs font-medium text-lgu-blue-900 truncate">{msg.subject}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        msg.status === 'Unread' ? 'bg-blue-100 text-blue-700' :
                        msg.status === 'Read' ? 'bg-slate-100 text-slate-600' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{selectedMessage.full_name}</h2>
                    <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'Replied')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Mark as Replied"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-grow space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3" />
                    Sent on {format(new Date(selectedMessage.created_at), 'MMMM d, yyyy h:mm a')}
                  </div>
                  <h3 className="text-xl font-bold text-lgu-blue-900">{selectedMessage.subject}</h3>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="w-4 h-4" />
                  To reply, send an email to <span className="font-bold text-lgu-blue-900">{selectedMessage.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center h-full min-h-[500px] text-slate-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
