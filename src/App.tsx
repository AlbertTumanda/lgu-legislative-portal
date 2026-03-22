/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Ordinances from './pages/Ordinances';
import LiveSession from './pages/LiveSession';
import Login from './pages/Login';
import Members from './pages/Members';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import LegislativeManagement from './pages/admin/LegislativeManagement';
import Comments from './pages/admin/Comments';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import ActivityLogs from './pages/admin/ActivityLogs';
import NewsManagement from './pages/admin/NewsManagement';
import MemberManagement from './pages/admin/MemberManagement';
import MessageManagement from './pages/admin/MessageManagement';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/ordinances" element={<PublicLayout><Ordinances /></PublicLayout>} />
            <Route path="/legislation" element={<PublicLayout><Ordinances /></PublicLayout>} />
            <Route path="/sessions" element={<PublicLayout><LiveSession /></PublicLayout>} />
            <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
            <Route path="/news/:id" element={<PublicLayout><NewsDetails /></PublicLayout>} />
            <Route path="/members" element={<PublicLayout><Members /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="legislations" element={<LegislativeManagement />} />
              <Route path="members" element={<MemberManagement />} />
              <Route path="messages" element={<MessageManagement />} />
              <Route path="comments" element={<Comments />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="users" element={<Users />} />
              <Route path="logs" element={<ActivityLogs />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

