import { useState, useEffect } from 'react';
import { Video, Calendar, MessageSquare, Send, ThumbsUp, Share2, Download, User } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveSession() {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock User for comment submission
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    barangay: ''
  });

  useEffect(() => {
    // Fetch latest session (simulated)
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setActiveSession(data[0]);
      });
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !userForm.name) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legislation_id: null, // General session comment
          session_id: activeSession?.id,
          user_name: userForm.name,
          barangay: userForm.barangay,
          email: userForm.email,
          content: comment
        })
      });
      
      // Optimistic update
      setComments([{
        id: Date.now(),
        user_name: userForm.name,
        content: comment,
        created_at: new Date().toISOString(),
        status: 'Pending' // In real app, this would be pending moderation
      }, ...comments]);
      
      setComment('');
      alert('Comment submitted for moderation!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeSession) return <div className="p-12 text-center">Loading session data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Video Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
            {activeSession.video_url ? (
              <iframe 
                src={activeSession.video_url} 
                className="w-full h-full" 
                title="Session Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white flex-col">
                <Video className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Stream Offline</p>
                <p className="text-sm text-slate-400">Next session starts: {activeSession.session_date}</p>
              </div>
            )}
            
            {/* Live Badge */}
            {activeSession.status === 'Live' && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Live Now
              </div>
            )}
          </div>

          {/* Session Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-serif font-bold text-lgu-blue-900">{activeSession.title}</h1>
                <div className="flex items-center text-slate-500 text-sm mt-2 space-x-4">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {format(new Date(activeSession.session_date), 'MMMM d, yyyy • h:mm a')}</span>
                  <span className="flex items-center"><Video className="w-4 h-4 mr-1" /> {activeSession.streaming_platform || 'YouTube'}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"><Share2 className="w-5 h-5" /></button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"><ThumbsUp className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-slate-900 mb-2">Session Agenda</h3>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-2">
                <p>1. Call to Order</p>
                <p>2. Invocation & National Anthem</p>
                <p>3. Roll Call</p>
                <p>4. Reading and Approval of Previous Minutes</p>
                <p>5. First Reading of Proposed Ordinances</p>
                <p>6. Committee Reports</p>
                <p>7. Unfinished Business</p>
                <p>8. Adjournment</p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button className="flex items-center text-sm text-lgu-blue-900 font-medium hover:underline">
                  <Download className="w-4 h-4 mr-1" /> Download Agenda (PDF)
                </button>
                <button className="flex items-center text-sm text-lgu-blue-900 font-medium hover:underline">
                  <Download className="w-4 h-4 mr-1" /> Committee Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Chat / Comments (1/3 width) */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="font-bold text-slate-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-lgu-gold-500" />
                Public Comments
              </h3>
              <p className="text-xs text-slate-500 mt-1">Comments are moderated. Be respectful.</p>
            </div>

            {/* Comments List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center text-slate-400 py-8 text-sm">
                  No comments yet. Be the first to share your thoughts.
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-bold text-slate-900">{c.user_name}</span>
                        <span className="text-xs text-slate-400">Just now</span>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{c.content}</p>
                      {c.status === 'Pending' && <span className="text-xs text-yellow-600 italic">Pending Moderation</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              {!userForm.name ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-600 uppercase">Join the discussion</p>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-lgu-blue-900"
                    onChange={e => setUserForm({...userForm, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-lgu-blue-900"
                    onChange={e => setUserForm({...userForm, email: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Barangay" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-lgu-blue-900"
                    onChange={e => setUserForm({...userForm, barangay: e.target.value})}
                  />
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="relative">
                  <textarea
                    className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-lgu-blue-900 resize-none text-sm"
                    rows={3}
                    placeholder="Type your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="absolute bottom-3 right-3 text-lgu-blue-900 hover:text-lgu-gold-600 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
