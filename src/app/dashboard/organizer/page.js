'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import AddInitiativeModal from '@/components/AddInitiativeModal';
import EditInitiativeModal from '@/components/EditInitiativeModal';

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [initiatives, setInitiatives] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalDonations: 0,
    totalInitiatives: 0,
    totalVolunteers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState({});
  const [volunteersByInitiative, setVolunteersByInitiative] = useState({});

  // Load organizer info from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.userType?.toLowerCase() !== 'organizer') {
        window.location.href = '/dashboard/user';
        return;
      }
      // Verify user exists in database
      verifyOrganizer(user.email);
      setOrganizer(user);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const verifyOrganizer = async (email) => {
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
      
      // Check if user is actually an organizer
      if (data.user.userType?.toLowerCase() !== 'organizer') {
        localStorage.removeItem('currentUser');
        window.location.href = '/dashboard/user';
      }
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  };

  // Load initiatives based on active tab
  useEffect(() => {
    if (organizer) {
      fetchInitiatives();
    }
  }, [activeTab, organizer]);

  const fetchInitiatives = async () => {
    setLoading(true);
    try {
      if (activeTab === 'volunteers') {
        // Fetch volunteers for all initiatives
        const response = await fetch(`/api/organizer/volunteers?organizerId=${organizer.id}`);
        const data = await response.json();

        // Normalize volunteer shape to make UI robust against key casing differences
        const normalized = (data.volunteers || []).map((v) => ({
          id: v.id ?? v.id,
          name: v.name ?? v.fullName ?? v.full_name ?? 'Unknown',
          present_location: v.present_location ?? v.presentLocation ?? v.presentLocation ?? v.presentLocation ?? '',
          profession: v.profession ?? v.profession ?? '',
          contributing_skill: v.contributing_skill ?? v.contributingSkill ?? v.skill ?? 'other',
          initiative_title: v.initiative_title ?? v.initiativeTitle ?? v.initiative_name ?? 'Unknown Initiative',
          created_at: v.created_at ?? v.createdAt ?? v.createdAt ?? new Date().toISOString(),
          status: v.status ?? 'pending',
          whatsapp_number: v.whatsapp_number ?? v.whatsappNumber ?? v.whatsapp ?? '',
          user_email: v.user_email ?? v.email ?? '',
        }));

        setVolunteers(normalized);
        setStats(prev => ({
          ...prev,
          totalVolunteers: normalized.length || 0,
        }));
      } else {
        // Fetch initiatives
        const response = await fetch(`/api/organizer/initiatives?type=${activeTab}&organizerId=${organizer.id}`);
        const data = await response.json();
        setInitiatives(data.initiatives || []);
        setStats(prev => ({
          ...prev,
          totalCollected: data.stats?.totalCollected || 0,
          totalDonations: data.stats?.totalDonations || 0,
          totalInitiatives: data.stats?.totalInitiatives || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInitiative = async (id) => {
    if (!window.confirm('Are you sure you want to delete this initiative?')) return;

    try {
      const response = await fetch(`/api/organizer/initiatives/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInitiatives(initiatives.filter((item) => item.id !== id));
        alert('Initiative deleted successfully');
      } else {
        alert('Failed to delete initiative');
      }
    } catch (error) {
      console.error('Error deleting initiative:', error);
      alert('Error deleting initiative');
    }
  };

  const handleExpandClick = async (initiativeId) => {
    if (expandedId === initiativeId) {
      setExpandedId(null);
    } else {
      setExpandedId(initiativeId);
      // Fetch payment breakdown
      try {
        const response = await fetch(`/api/initiatives/${initiativeId}/donations-by-method`);
        if (response.ok) {
          const data = await response.json();
          setPaymentBreakdown(prev => ({ ...prev, [initiativeId]: data }));
        }
      } catch (error) {
        console.error('Error fetching payment breakdown:', error);
      }
    }
  };

  const handleEditClick = (initiative) => {
    setEditingInitiative(initiative);
    setShowEditModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchInitiatives();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingInitiative(null);
    fetchInitiatives();
  };

  if (!organizer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'seminars', label: 'Seminars' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'volunteers', label: 'Volunteers' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="mt-1 text-gray-600">Welcome, {organizer.firstName}! Manage your initiatives below.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 transition"
            >
              <Plus size={20} />
              New Initiative
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {activeTab !== 'volunteers' ? (
              <>
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Collected So Far</p>
                  <p className="mt-1 text-2xl font-bold text-sky-700">৳ {stats.totalCollected.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Total Donations</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Active In This Tab</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalInitiatives}</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 md:col-span-3">
                <p className="text-sm font-medium text-gray-500">Total Volunteer Requests</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.totalVolunteers}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === tab.id
                    ? 'border-b-2 border-sky-600 text-sky-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <div className="text-gray-600">Loading initiatives...</div>
          </div>
        )}

        {/* Initiatives List */}
        {!loading && activeTab !== 'volunteers' && initiatives.length > 0 && (
          <div className="space-y-4">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{initiative.title}</h3>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                        {activeTab}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{initiative.short_description}</p>

                    {/* Toggle Details */}
                    <button
                      onClick={() => handleExpandClick(initiative.id)}
                      className="mt-3 flex items-center gap-1 text-sky-600 hover:text-sky-700 font-medium"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition ${expandedId === initiative.id ? 'rotate-180' : ''}`}
                      />
                      {expandedId === initiative.id ? 'Hide Details' : 'Show Details'}
                    </button>

                    {/* Expanded Details */}
                    {expandedId === initiative.id && (
                      <div>
                        <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date & Time</p>
                            <p className="text-gray-900">{initiative.date} {initiative.time || ''}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Expected Budget</p>
                            <p className="text-gray-900">৳ {initiative.expected_budget?.toLocaleString() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Collected Donations</p>
                            <p className="text-gray-900">৳ {initiative.collected_amount?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Donation Count</p>
                            <p className="text-gray-900">{initiative.donation_count || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Manpower Needed</p>
                            <p className="text-gray-900">{initiative.manpower || 'N/A'} people</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Payment Methods</p>
                            <div className="text-gray-900 space-y-1">
                              {initiative.bkash_number && <p>bKash: {initiative.bkash_number}</p>}
                              {initiative.nagad_number && <p>Nagad: {initiative.nagad_number}</p>}
                              {initiative.bank_account && <p>Bank: {initiative.bank_account}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Payment Gateway Breakdown */}
                        {paymentBreakdown[initiative.id] && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Donations by Payment Gateway</p>
                            <div className="grid grid-cols-2 gap-3">
                              {paymentBreakdown[initiative.id].bkash > 0 && (
                                <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-3 border border-orange-200">
                                  <p className="text-xs font-medium text-orange-700">bKash</p>
                                  <p className="text-lg font-bold text-orange-900">৳ {paymentBreakdown[initiative.id].bkash.toLocaleString()}</p>
                                </div>
                              )}
                              {paymentBreakdown[initiative.id].rocket > 0 && (
                                <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-3 border border-red-200">
                                  <p className="text-xs font-medium text-red-700">Rocket</p>
                                  <p className="text-lg font-bold text-red-900">৳ {paymentBreakdown[initiative.id].rocket.toLocaleString()}</p>
                                </div>
                              )}
                              {paymentBreakdown[initiative.id].nagad > 0 && (
                                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3 border border-blue-200">
                                  <p className="text-xs font-medium text-blue-700">Nagad</p>
                                  <p className="text-lg font-bold text-blue-900">৳ {paymentBreakdown[initiative.id].nagad.toLocaleString()}</p>
                                </div>
                              )}
                              {paymentBreakdown[initiative.id].bank > 0 && (
                                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-3 border border-purple-200">
                                  <p className="text-xs font-medium text-purple-700">DBBL Bank</p>
                                  <p className="text-lg font-bold text-purple-900">৳ {paymentBreakdown[initiative.id].bank.toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                            {paymentBreakdown[initiative.id].bkash === 0 && 
                             paymentBreakdown[initiative.id].rocket === 0 && 
                             paymentBreakdown[initiative.id].nagad === 0 && 
                             paymentBreakdown[initiative.id].bank === 0 && (
                              <p className="text-xs text-gray-500 italic">No donations received yet</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-lg bg-emerald-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Collected</p>
                        <p className="mt-1 text-lg font-bold text-emerald-900">৳ {initiative.collected_amount?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="rounded-lg bg-amber-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Progress</p>
                        <p className="mt-1 text-lg font-bold text-amber-900">
                          {initiative.expected_budget
                            ? `${Math.min(100, Math.round(((initiative.collected_amount || 0) / initiative.expected_budget) * 100))}%`
                            : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => handleEditClick(initiative)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteInitiative(initiative.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Volunteers List */}
        {!loading && activeTab === 'volunteers' && volunteers.length > 0 && (
          <div className="space-y-4">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{volunteer.name}</h3>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                        Volunteer
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="mt-1 text-gray-900">{volunteer.present_location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Profession</p>
                        <p className="mt-1 text-gray-900">{volunteer.profession}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Skill</p>
                        <p className="mt-1 text-gray-900">{volunteer.contributing_skill.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Initiative</p>
                        <p className="mt-1 text-gray-900">{volunteer.initiative_title}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">WhatsApp Contact</p>
                        <a 
                          href={`https://wa.me/${volunteer.whatsapp_number.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-emerald-600 hover:text-emerald-700 font-medium break-all"
                        >
                          {volunteer.whatsapp_number}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Applied</p>
                        <p className="mt-1 text-gray-900">{new Date(volunteer.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="mt-1">
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                            {volunteer.status || 'pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && activeTab !== 'volunteers' && initiatives.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <p className="mb-4 text-gray-600">No {activeTab} yet. Create your first initiative!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-700 transition"
            >
              <Plus size={20} />
              Create {activeTab.slice(0, -1)}
            </button>
          </div>
        )}

        {/* Empty State for Volunteers */}
        {!loading && activeTab === 'volunteers' && volunteers.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <p className="text-gray-600">No volunteer requests yet. When users volunteer, they'll appear here.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddInitiativeModal
          type={activeTab}
          organizerId={organizer.id}
          organizerName={`${organizer.firstName} ${organizer.lastName}`}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {showEditModal && editingInitiative && (
        <EditInitiativeModal
          initiative={editingInitiative}
          type={activeTab}
          onClose={() => {
            setShowEditModal(false);
            setEditingInitiative(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
