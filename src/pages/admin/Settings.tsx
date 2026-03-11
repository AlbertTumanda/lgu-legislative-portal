import { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Save, Shield, Bell, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    full_name: user?.name || '',
    email: user?.email || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...profileData, role: user?.role })
      });
      if (res.ok) {
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setLoading(true);
    setSuccess('');
    try {
      const res = await fetch(`/api/users/${user?.id}/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordData.newPassword })
      });
      if (res.ok) {
        setSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Failed to update password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-lgu-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-5 h-5 mr-3" /> Profile Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'security' ? 'bg-lgu-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-5 h-5 mr-3" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'notifications' ? 'bg-lgu-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'system' ? 'bg-lgu-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-5 h-5 mr-3" /> System Config
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center font-bold text-sm">
              <Shield className="w-5 h-5 mr-2" /> {success}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-lgu-blue-900" /> Personal Information
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      value={profileData.full_name}
                      onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-lgu-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors flex items-center disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-lgu-blue-900" /> Change Password
                </h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900"
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-lgu-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-lgu-blue-800 transition-colors flex items-center disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" /> {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {(activeTab === 'notifications' || activeTab === 'system') && (
              <div className="p-12 text-center">
                <SettingsIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Advanced Settings</h3>
                <p className="text-slate-500">These settings are currently managed by the system administrator.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
