import { useState, useEffect } from 'react';
import { FileText, Calendar, Plus, Edit2, Trash2, Search, CheckCircle, Clock, AlertCircle, FileUp, X, File } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

type Tab = 'legislations' | 'sessions';

export default function LegislativeManagement() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('legislations');
  const [legislations, setLegislations] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Form States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = activeTab === 'legislations' ? '/api/legislations' : '/api/sessions';
      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (activeTab === 'legislations') setLegislations(data);
      else setSessions(data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(activeTab === 'legislations' ? {
        legislation_type: 'Ordinance',
        status: 'Proposed',
        number: '',
        title: '',
        description: '',
        author: '',
        date_approved: ''
      } : {
        title: '',
        session_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        type: 'Regular',
        status: 'Scheduled',
        description: '',
        streaming_platform: 'YouTube'
      });
    }
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, file_url: data.url });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const endpoint = activeTab === 'legislations' 
      ? (editingItem ? `/api/legislations/${editingItem.id}` : '/api/legislations')
      : (editingItem ? `/api/sessions/${editingItem.id}` : '/api/sessions');

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const endpoint = activeTab === 'legislations' ? `/api/legislations/${id}` : `/api/sessions/${id}`;
    try {
      const res = await fetch(endpoint, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredItems = (activeTab === 'legislations' ? legislations : sessions).filter(item => 
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Legislative Management</h1>
          <p className="text-slate-500">Manage municipal ordinances, resolutions, and session schedules.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-lgu-blue-900 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-lgu-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add {activeTab === 'legislations' ? 'Legislation' : 'Session'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('legislations')}
          className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'legislations' ? 'text-lgu-blue-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Ordinances & Resolutions
          </div>
          {activeTab === 'legislations' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-lgu-blue-900 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('sessions')}
          className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'sessions' ? 'text-lgu-blue-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Session Calendar
          </div>
          {activeTab === 'sessions' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-lgu-blue-900 rounded-t-full"></div>}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab === 'legislations' ? 'ordinances, resolutions...' : 'sessions...'}`}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No items found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {activeTab === 'legislations' ? (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type / Number</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Session Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </>
                )}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  {activeTab === 'legislations' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-lgu-blue-900 uppercase">{item.legislation_type}</div>
                        <div className="text-sm text-slate-500">{item.number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-slate-500">By {item.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Archieved' ? 'bg-slate-100 text-slate-700' :
                          item.status === 'Layed on the table' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.file_url ? (
                          <a 
                            href={item.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-lgu-blue-900 hover:text-lgu-gold-600 font-bold text-xs"
                          >
                            <File className="w-4 h-4 mr-1" /> PDF
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs italic">No file</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {item.date_approved ? format(new Date(item.date_approved), 'MMM d, yyyy') : '-'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {format(new Date(item.session_date), 'MMM d, yyyy • h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          item.status === 'Live' ? 'bg-red-100 text-red-700 animate-pulse' : 
                          item.status === 'Ended' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="text-lgu-blue-900 hover:text-lgu-gold-600 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'legislations' ? 'Legislation' : 'Session'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {activeTab === 'legislations' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        value={formData.legislation_type}
                        onChange={e => setFormData({...formData, legislation_type: e.target.value})}
                      >
                        <option value="Ordinance">Ordinance</option>
                        <option value="Resolution">Resolution</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Number</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        placeholder="e.g. Ord. No. 2024-001"
                        value={formData.number}
                        onChange={e => setFormData({...formData, number: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      placeholder="Legislative Title"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900 h-24 resize-none"
                      placeholder="Brief summary..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Author</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        placeholder="Hon. Name"
                        value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Proposed">Proposed</option>
                        <option value="On 1st Reading">On 1st Reading</option>
                        <option value="On 2nd Reading">On 2nd Reading</option>
                        <option value="On 3rd Reading">On 3rd Reading</option>
                        <option value="Approved">Approved</option>
                        <option value="Vetoed">Vetoed</option>
                        <option value="Archieved">Archieved</option>
                        <option value="Layed on the table">Layed on the table</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date Approved (if applicable)</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      value={formData.date_approved || ''}
                      onChange={e => setFormData({...formData, date_approved: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Attach Document (PDF Only)</label>
                    {formData.file_url ? (
                      <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <File className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Document Attached</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, file_url: ''})}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input 
                          type="file" 
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          disabled={uploading}
                        />
                        <label 
                          htmlFor="file-upload"
                          className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-lgu-blue-900 hover:bg-slate-50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-center">
                            <FileUp className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'animate-bounce' : 'text-slate-400'}`} />
                            <span className="text-sm font-bold text-slate-600">
                              {uploading ? 'Uploading...' : 'Click to upload PDF softcopy'}
                            </span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Session Title</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      placeholder="e.g. 15th Regular Session"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        value={formData.session_date}
                        onChange={e => setFormData({...formData, session_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="Regular">Regular</option>
                        <option value="Special">Special</option>
                        <option value="Public Hearing">Public Hearing</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Live">Live</option>
                        <option value="Ended">Ended</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Streaming Platform</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                        placeholder="YouTube / Facebook"
                        value={formData.streaming_platform || ''}
                        onChange={e => setFormData({...formData, streaming_platform: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Video URL (Embed Link)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      placeholder="https://www.youtube.com/embed/..."
                      value={formData.video_url || ''}
                      onChange={e => setFormData({...formData, video_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Agenda Summary</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900 h-24 resize-none"
                      placeholder="Brief agenda..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-lgu-blue-900 text-white rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
