import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, ArrowRight, Video, Users, Facebook, Youtube, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Home() {
  const [ordinances, setOrdinances] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/legislations')
      .then(res => res.json())
      .then(data => setOrdinances(data.slice(0, 3))); // Get top 3 (Ordinances or Resolutions)
    
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        const live = data.find((s: any) => s.status === 'Live');
        if (live) {
          const others = data.filter((s: any) => s.id !== live.id);
          setSessions([live, ...others]);
        } else {
          setSessions(data);
        }
      });

    fetch('/api/news?limit=3')
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-lgu-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/SESSION.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight !text-white">
              Legislative Transparency <br />
              <span className="text-lgu-gold-500">at Your Fingertips</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Access ordinances, watch live sessions, and participate in the legislative process of Batuan. Your voice matters in local governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/ordinances" className="bg-lgu-gold-500 text-lgu-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-lgu-gold-600 transition-colors text-center w-full sm:w-auto">
                Search Ordinances
              </Link>
              <Link to="/sessions" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors text-center flex items-center justify-center w-full sm:w-auto">
                <Video className="w-5 h-5 mr-2" />
                Watch Live Session
              </Link>
              <div className="flex space-x-3 ml-0 sm:ml-4">
                <a href="https://web.facebook.com/profile.php?id=100090571482008" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-lgu-gold-500 hover:text-lgu-blue-900 transition-all border border-white/20">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@13thSangguniangBayanBatuanBoh" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-lgu-gold-500 hover:text-lgu-blue-900 transition-all border border-white/20">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats / Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-lgu-gold-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Latest Ordinances</h3>
              <FileText className="text-lgu-gold-500 w-6 h-6" />
            </div>
            <p className="text-slate-600 text-sm mb-4">Browse recently approved municipal laws and regulations.</p>
            <Link to="/ordinances" className="text-lgu-blue-900 font-medium text-sm hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Session Calendar</h3>
              <Calendar className="text-blue-500 w-6 h-6" />
            </div>
            <p className="text-slate-600 text-sm mb-4">
              {sessions.length > 0 ? (
                <>
                  Next Session: <span className="font-bold text-lgu-blue-900">
                    {(() => {
                      const next = sessions.find(s => s.status === 'Scheduled' || s.status === 'Live');
                      return next ? `${new Date(next.session_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ${new Date(next.session_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : 'No upcoming sessions';
                    })()}
                  </span>
                </>
              ) : (
                'No upcoming sessions scheduled.'
              )}
            </p>
            <Link to="/sessions" className="text-lgu-blue-900 font-medium text-sm hover:underline flex items-center">
              View Full Schedule <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-800">Public Participation</h3>
              <Users className="text-green-500 w-6 h-6" />
            </div>
            <p className="text-slate-600 text-sm mb-4">Submit comments, suggestions, and feedback on proposed measures.</p>
            <Link to="/contact" className="text-lgu-blue-900 font-medium text-sm hover:underline flex items-center">
              Get Involved <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Ordinances */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-lgu-blue-900">Recent Legislation</h2>
            <p className="text-slate-600 mt-2">Latest approved ordinances and resolutions.</p>
          </div>
          <Link to="/ordinances" className="hidden md:flex items-center text-lgu-blue-900 font-medium hover:text-lgu-gold-600">
            View Archive <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ordinances.map((ord) => (
            <div key={ord.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-4">
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${
                  ord.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ord.status}
                </span>
                <span className="ml-2 text-xs text-slate-500">{ord.number}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{ord.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">{ord.description}</p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500">Authored by {ord.author}</span>
                {ord.file_url ? (
                  <a 
                    href={ord.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-lgu-blue-900 hover:underline"
                  >
                    Read Full Text
                  </a>
                ) : (
                  <Link to={`/ordinances/${ord.id}`} className="text-sm font-medium text-lgu-blue-900 hover:underline">
                    Read Full Text
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News & Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-lgu-blue-900">News & Events</h2>
            <p className="text-slate-600 mt-2">Stay updated with the latest happenings in Batuan.</p>
          </div>
          <Link to="/news" className="hidden md:flex items-center text-lgu-blue-900 font-medium hover:text-lgu-gold-600">
            View All News <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Newspaper className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    item.category === 'News' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-slate-500 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.event_date ? format(new Date(item.event_date), 'MMMM d, yyyy') : format(new Date(item.created_at), 'MMMM d, yyyy')}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-lgu-blue-900 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="text-xs font-medium text-lgu-gold-600 mb-3 uppercase tracking-wider">By {item.author}</p>
                )}
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {item.content}
                </p>
                <div className="text-sm font-bold text-lgu-blue-900 group-hover:text-lgu-gold-600 transition-colors flex items-center">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Session Preview */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide mb-4">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                Live Streaming
              </div>
              <h2 className="text-3xl font-serif font-bold text-lgu-blue-900 mb-4">
                {sessions[0]?.status === 'Live' ? 'Live Now: ' : ''}
                {sessions[0]?.title || 'Watch Sessions Live'}
              </h2>
              <p className="text-slate-600 mb-6">
                {sessions[0]?.description || 'Transparency is key to good governance. Watch our regular sessions live, or browse our archive of past sessions.'}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="bg-white p-2 rounded shadow-sm mr-3 text-lgu-blue-900"><Video className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">High Definition Streaming</h4>
                    <p className="text-xs text-slate-500">Clear audio and video via YouTube & Facebook</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white p-2 rounded shadow-sm mr-3 text-lgu-blue-900"><FileText className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Real-time Agenda</h4>
                    <p className="text-xs text-slate-500">Follow along with downloadable documents</p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link to="/sessions" className="bg-lgu-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors inline-block">
                  Go to Live Portal
                </Link>
                <a href="https://www.youtube.com/@13thSangguniangBayanBatuanBoh" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center">
                  <Youtube className="w-5 h-5 mr-2" /> Subscribe on YouTube
                </a>
                <a href="https://web.facebook.com/profile.php?id=100090571482008" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center">
                  <Facebook className="w-5 h-5 mr-2" /> Follow on Facebook
                </a>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                 {sessions[0]?.video_url ? (
                   <iframe 
                     className="w-full h-full"
                     src={sessions[0].video_url} 
                     title={sessions[0].title} 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-white">
                     <Video className="w-12 h-12 mb-2 opacity-50" />
                     <p className="text-sm font-medium">No video available</p>
                   </div>
                 )}
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">{sessions[0]?.title || 'Recent Session'}</h3>
                <p className="text-sm text-slate-500">{sessions[0] ? new Date(sessions[0].session_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Watch the session proceedings.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
