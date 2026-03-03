import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, ArrowRight, Video, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [ordinances, setOrdinances] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/legislations?type=Ordinance')
      .then(res => res.json())
      .then(data => setOrdinances(data.slice(0, 3))); // Get top 3
    
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data.slice(0, 2))); // Get top 2
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-lgu-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/SESSION.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight text-white">
              Legislative Transparency <br />
              <span className="text-lgu-gold-500">at Your Fingertips</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Access ordinances, watch live sessions, and participate in the legislative process of Batuan. Your voice matters in local governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ordinances" className="bg-lgu-gold-500 text-lgu-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-lgu-gold-600 transition-colors text-center">
                Search Ordinances
              </Link>
              <Link to="/sessions" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors text-center flex items-center justify-center">
                <Video className="w-5 h-5 mr-2" />
                Watch Live Session
              </Link>
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
            <p className="text-slate-600 text-sm mb-4">Check the schedule for upcoming regular and special sessions.</p>
            <Link to="/sessions" className="text-lgu-blue-900 font-medium text-sm hover:underline flex items-center">
              View Schedule <ArrowRight className="w-4 h-4 ml-1" />
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
                <Link to={`/ordinances/${ord.id}`} className="text-sm font-medium text-lgu-blue-900 hover:underline">
                  Read Full Text
                </Link>
              </div>
            </div>
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
              <h2 className="text-3xl font-serif font-bold text-lgu-blue-900 mb-4">Watch Sessions Live</h2>
              <p className="text-slate-600 mb-6">
                Transparency is key to good governance. Watch our regular sessions live every Tuesday at 2:00 PM, or browse our archive of past sessions.
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
              <Link to="/sessions" className="bg-lgu-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors inline-block">
                Go to Live Portal
              </Link>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative group">
                 <iframe 
                   className="w-full h-full"
                   src="https://www.youtube.com/embed/YDqIcEZOHMg" 
                   title="Regular Session" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 ></iframe>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Regular Session</h3>
                <p className="text-sm text-slate-500">Watch the session proceedings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
