import { useState, useEffect } from 'react';
import { Search, Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const url = '/api/news';
    const params = new URLSearchParams();
    if (category !== 'All') params.append('category', category);
    
    fetch(url + (params.toString() ? `?${params.toString()}` : ''))
      .then(res => res.json())
      .then(data => {
        if (search) {
          const filtered = data.filter((item: any) => 
            item.title.toLowerCase().includes(search.toLowerCase()) || 
            item.content.toLowerCase().includes(search.toLowerCase())
          );
          setNews(filtered);
        } else {
          setNews(data);
        }
      });
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-lgu-blue-900">News & Events</h1>
        <p className="text-slate-600 mt-2">Stay updated with the latest happenings and announcements in Batuan.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search news and events..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lgu-gold-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lgu-gold-500 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="News">News</option>
            <option value="Event">Events</option>
            <option value="Announcement">Announcements</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <Link 
              key={item.id} 
              to={`/news/${item.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer flex flex-col"
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
              <div className="p-6 flex flex-col flex-grow">
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
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {item.content}
                </p>
                <div className="text-sm font-bold text-lgu-blue-900 group-hover:text-lgu-gold-600 transition-colors flex items-center mt-auto pt-4 border-t border-slate-50">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900">No news found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
