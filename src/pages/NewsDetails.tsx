import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Newspaper, Share2, Facebook, Twitter } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setItem(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lgu-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Article Header/Hero */}
      <div className="bg-lgu-blue-900 text-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          
          <div className="flex items-center space-x-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              item.category === 'News' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
            }`}>
              {item.category}
            </span>
            <span className="text-slate-400 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {item.event_date ? format(new Date(item.event_date), 'MMMM d, yyyy') : format(new Date(item.created_at), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight !text-white mb-4">
            {item.title}
          </h1>
          {item.author && (
            <p className="text-slate-300 font-medium">By {item.author}</p>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {item.image_url && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              {item.content.split('\n').map((paragraph: string, idx: number) => (
                paragraph.trim() ? <p key={idx} className="text-slate-700 text-lg leading-relaxed mb-6">{paragraph}</p> : null
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Share this article</span>
                <div className="flex space-x-2">
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-sky-500 hover:text-white transition-all">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <Link to="/" className="text-lgu-blue-900 font-bold hover:underline flex items-center">
                <Newspaper className="w-5 h-5 mr-2" /> More News & Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
