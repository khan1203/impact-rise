'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditInitiativeModal({ initiative, type, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: initiative.title || '',
    short_description: initiative.short_description || '',
    description: initiative.description || '',
    date: initiative.date || '',
    time: initiative.time || '',
    manpower: initiative.manpower || '',
    expected_budget: initiative.expected_budget || '',
    bkash_number: initiative.bkash_number || '',
    nagad_number: initiative.nagad_number || '',
    bank_account: initiative.bank_account || '',
    banner_url: initiative.banner_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.short_description.trim()) {
      setError('Short description is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }
    if (!formData.expected_budget) {
      setError('Expected budget is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/organizer/initiatives/${initiative.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expected_budget: parseInt(formData.expected_budget) || 0,
          manpower: parseInt(formData.manpower) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update initiative');
        return;
      }

      alert('Initiative updated successfully!');
      onSuccess();
    } catch (err) {
      setError('Error updating initiative');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Edit {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter initiative title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief summary (1-2 lines)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the initiative"
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Manpower and Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manpower Needed
              </label>
              <input
                type="number"
                name="manpower"
                value={formData.manpower}
                onChange={handleChange}
                placeholder="Number of people"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Budget (৳) *
              </label>
              <input
                type="number"
                name="expected_budget"
                value={formData.expected_budget}
                onChange={handleChange}
                placeholder="Budget amount"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                bKash Number
              </label>
              <input
                type="text"
                name="bkash_number"
                value={formData.bkash_number}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nagad Number
              </label>
              <input
                type="text"
                name="nagad_number"
                value={formData.nagad_number}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account
            </label>
            <input
              type="text"
              name="bank_account"
              value={formData.bank_account}
              onChange={handleChange}
              placeholder="Bank account number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              name="banner_url"
              value={formData.banner_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-600 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Initiative'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
