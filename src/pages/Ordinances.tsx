import { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText } from 'lucide-react';

export default function Ordinances() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    let url = '/api/legislations';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterType !== 'All') params.append('type', filterType);
    
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [search, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-lgu-blue-900">Ordinances & Resolutions</h1>
        <p className="text-slate-600 mt-2">Search and download municipal legislative documents.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title, number, or keyword..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lgu-gold-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lgu-gold-500 bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Ordinance">Ordinances</option>
            <option value="Resolution">Resolutions</option>
          </select>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-medium flex items-center">
            <Filter className="w-4 h-4 mr-2" /> More Filters
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Number / Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title / Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{item.number}</div>
                      <div className="text-xs text-slate-500">{item.legislation_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-lgu-blue-900">{item.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Vetoed' ? 'bg-red-100 text-red-800' : 
                        item.status === 'Archieved' ? 'bg-slate-100 text-slate-800' :
                        item.status === 'Layed on the table' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.date_approved || 'Pending'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.file_url ? (
                        <a 
                          href={item.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lgu-blue-900 hover:text-lgu-gold-600 flex items-center justify-end w-full"
                        >
                          <Download className="w-4 h-4 mr-1" /> PDF
                        </a>
                      ) : (
                        <button 
                          disabled 
                          className="text-slate-300 flex items-center justify-end w-full cursor-not-allowed"
                        >
                          <Download className="w-4 h-4 mr-1" /> N/A
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    No documents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
