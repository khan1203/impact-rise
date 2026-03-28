'use client';

import { useEffect, useState } from 'react';
import { Heart, DollarSign, CheckCircle } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    const userData = JSON.parse(currentUser);

    // Verify user exists in database
    verifyUser(userData.email);
  }, []);

  const verifyUser = async (email) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // User not found in database
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome, {user.firstName}!</h1>
          <p className="text-gray-600">View your donation history and saved initiatives.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Donated */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-sky-100 p-4">
                <DollarSign size={24} className="text-sky-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">৳ 0</p>
              </div>
            </div>
          </div>

          {/* Donations Made */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-4">
                <Heart size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Donations Made</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          {/* Campaigns Supported */}
          <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Campaigns Supported</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Donations</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No donations made yet. Start supporting initiatives today!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
