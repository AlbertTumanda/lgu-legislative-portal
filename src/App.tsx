/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Ordinances from './pages/Ordinances';
import LiveSession from './pages/LiveSession';
import Login from './pages/Login';
import Members from './pages/Members';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/ordinances" element={<PublicLayout><Ordinances /></PublicLayout>} />
          <Route path="/resolutions" element={<PublicLayout><Ordinances /></PublicLayout>} /> {/* Reusing component with filter */}
          <Route path="/sessions" element={<PublicLayout><LiveSession /></PublicLayout>} />
          <Route path="/members" element={<PublicLayout><Members /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><div className="p-12 text-center">Contact Page (Coming Soon)</div></PublicLayout>} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="legislations" element={<div className="p-8">Legislative Management (Coming Soon)</div>} />
            <Route path="sessions" element={<div className="p-8">Session Management (Coming Soon)</div>} />
            <Route path="comments" element={<div className="p-8">Comment Moderation (Coming Soon)</div>} />
            <Route path="users" element={<div className="p-8">User Management (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

