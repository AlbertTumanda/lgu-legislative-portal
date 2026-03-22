import { useState, useEffect, useCallback } from 'react';
import { User, Shield, Award } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch members:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const viceMayor = members.find(m => m.position === 'Vice Mayor');
  const councilMembers = members.filter(m => m.position !== 'Vice Mayor');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 bg-slate-200 w-48 rounded mb-2"></div>
          <div className="h-3 bg-slate-200 w-32 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-lgu-blue-900 mb-4">Sangguniang Bayan Members</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Meet the dedicated public servants working to craft legislation for the betterment of Batuan.
        </p>
      </div>

      {/* Vice Mayor Section */}
      {viceMayor && (
        <div className="mb-16 flex justify-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm w-full border-t-4 border-lgu-gold-500 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="aspect-[3/4] bg-slate-100 relative">
              {viceMayor.image_url ? (
                <img src={viceMayor.image_url} alt={viceMayor.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-lgu-blue-50 text-lgu-blue-200">
                  <User className="w-32 h-32" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <span className="inline-block px-3 py-1 bg-lgu-gold-500 text-lgu-blue-900 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  Presiding Officer
                </span>
              </div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-lgu-blue-900 mb-1">{viceMayor.full_name}</h2>
              <p className="text-lgu-gold-600 font-medium uppercase tracking-wide mb-4">{viceMayor.position}</p>
              
              {(viceMayor.committees_chairmanship || viceMayor.committees_membership) && (
                <div className="pt-4 border-t border-slate-100 text-left space-y-3">
                  {viceMayor.committees_chairmanship && (
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-lgu-gold-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Committee Chairmanship</p>
                        <p className="text-xs text-slate-600">{viceMayor.committees_chairmanship}</p>
                      </div>
                    </div>
                  )}
                  {viceMayor.committees_membership && (
                    <div className="flex items-start">
                      <Award className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Committee Membership</p>
                        <p className="text-xs text-slate-600">{viceMayor.committees_membership}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Council Members Grid */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-lgu-blue-900 mb-8 text-center relative">
          <span className="bg-slate-50 px-4 relative z-10">Municipal Council Members</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-0"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {councilMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col">
              <div className="aspect-[3/4] bg-slate-100 relative group">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-lgu-blue-300 transition-colors">
                    <User className="w-20 h-20" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-slate-900 mb-1 leading-tight">{member.full_name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">{member.position}</p>
                </div>

                {(member.committees_chairmanship || member.committees_membership) && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {member.committees_chairmanship && (
                      <div className="flex items-start">
                        <Shield className="w-3.5 h-3.5 text-lgu-gold-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Chairmanship</p>
                          <p className="text-[11px] text-slate-600 leading-tight">{member.committees_chairmanship}</p>
                        </div>
                      </div>
                    )}
                    {member.committees_membership && (
                      <div className="flex items-start">
                        <Award className="w-3.5 h-3.5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Membership</p>
                          <p className="text-[11px] text-slate-600 leading-tight">{member.committees_membership}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
