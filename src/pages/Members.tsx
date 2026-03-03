import { User } from 'lucide-react';

export default function Members() {
  const viceMayor = {
    name: "Atty. Antonino M. Jumawid",
    role: "Vice Mayor",
    image: "/dodojumawid.png"
  };

  const councilMembers = [
    { name: "Joel Daquis", role: "Municipal Councilor", image: "/joel_daquis.png" },
    { name: 'Precious Joy "Yes" Dumagan-Baguio', role: "Municipal Councilor", image: "/yes.png" },
    { name: "Sixto T. Dano", role: "Municipal Councilor", image: null },
    { name: "Marvin Pancho", role: "Municipal Councilor", image: null },
    { name: "Ronald T. Dampog", role: "Municipal Councilor", image: "/ronie_dampog.png" },
    { name: "Jesus Palingcod", role: "Municipal Councilor", image: "/jesus_palingcod.png" },
    { name: "Candido Salces", role: "Municipal Councilor", image: "/candido_salces.png" },
    { name: "Segundo Bautista", role: "Municipal Councilor", image: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-lgu-blue-900 mb-4">Sangguniang Bayan Members</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Meet the dedicated public servants working to craft legislation for the betterment of Batuan.
        </p>
      </div>

      {/* Vice Mayor Section */}
      <div className="mb-16 flex justify-center">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full border-t-4 border-lgu-gold-500 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="aspect-[4/3] bg-slate-200 relative">
            {viceMayor.image ? (
              <img src={viceMayor.image} alt={viceMayor.name} className="w-full h-full object-cover" />
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
            <h2 className="text-2xl font-bold text-lgu-blue-900 mb-1">{viceMayor.name}</h2>
            <p className="text-lgu-gold-600 font-medium uppercase tracking-wide">{viceMayor.role}</p>
          </div>
        </div>
      </div>

      {/* Council Members Grid */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-lgu-blue-900 mb-8 text-center relative">
          <span className="bg-slate-50 px-4 relative z-10">Municipal Council Members</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-0"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {councilMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <div className="aspect-square bg-slate-100 relative group">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-lgu-blue-300 transition-colors">
                    <User className="w-20 h-20" />
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
