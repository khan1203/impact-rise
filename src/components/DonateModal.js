'use client';

import { useState } from 'react';

export default function DonateModal({ campaignTitle = 'this campaign', initiativeId }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(currentUser);
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          initiative_id: initiativeId,
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Donation failed');
        return;
      }

      alert(`Thank you for donating BDT ${amount || 0} to ${campaignTitle}.`);
      setOpen(false);
      setAmount('');
    } catch (submitError) {
      console.error(submitError);
      setError('Donation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:shadow-2xl"
      >
        Donate Now
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-2xl font-bold">Donate</h3>
            <p className="mb-4 text-sm text-gray-600">Support {campaignTitle}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in BDT"
                className="w-full rounded-lg border px-3 py-2"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-lg border px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white"
                >
                  {loading ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
