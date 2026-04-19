'use client';

import { useState } from 'react';

export default function VolunteerModal({ initiativeTitle = 'this initiative', initiativeId }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    present_location: '',
    profession: '',
    contributing_skill: 'other',
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const skills = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'content_writing', label: 'Content Writing' },
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'video_production', label: 'Video Production' },
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'communication', label: 'Communication' },
    { value: 'other', label: 'Other Skill' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.present_location.trim()) {
      setError('Please enter your location');
      return;
    }

    if (!formData.profession.trim()) {
      setError('Please enter your profession');
      return;
    }

    if (!formData.contributing_skill) {
      setError('Please select a skill');
      return;
    }

    if (!formData.whatsapp_number.trim()) {
      setError('Please enter your WhatsApp contact number');
      return;
    }

    // Basic phone validation (should be at least 10 digits)
    const phoneDigits = formData.whatsapp_number.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(currentUser);
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          initiative_id: initiativeId,
          name: formData.name.trim(),
          present_location: formData.present_location.trim(),
          profession: formData.profession.trim(),
          contributing_skill: formData.contributing_skill,
          whatsapp_number: formData.whatsapp_number.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit volunteer request');
        return;
      }

      alert(`Thank you for volunteering to contribute as ${formData.profession} to ${initiativeTitle}!`);
      setOpen(false);
      setFormData({
        name: '',
        present_location: '',
        profession: '',
        contributing_skill: 'other',
        whatsapp_number: '',
      });
      // Optionally refresh the page to show updated volunteer count
      window.location.reload();
    } catch (submitError) {
      console.error(submitError);
      setError('Failed to submit volunteer request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-4 text-lg font-semibold text-white hover:shadow-2xl"
      >
        Volunteer
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-2 text-2xl font-bold">Volunteer</h3>
            <p className="mb-6 text-sm text-gray-600">Contribute your skills to {initiativeTitle}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Present Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Present Location *
                </label>
                <input
                  type="text"
                  name="present_location"
                  value={formData.present_location}
                  onChange={handleChange}
                  placeholder="Enter your city/area"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profession *
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Enter your profession"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Contributing Skill Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contributing Skill *
                </label>
                <select
                  name="contributing_skill"
                  value={formData.contributing_skill}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {skills.map(skill => (
                    <option key={skill.value} value={skill.value}>
                      {skill.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="Enter your WhatsApp number (e.g., +880171234567 or 01712345678)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-1 text-xs text-gray-500">We'll use this to contact you about volunteer opportunities</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
