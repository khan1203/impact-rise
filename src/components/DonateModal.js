'use client';

import { useState } from 'react';

export default function DonateModal({ campaignTitle = 'this campaign' }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Thank you for donating BDT ${amount || 0} to ${campaignTitle}.`);
    setOpen(false);
    setAmount('');
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
                  className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
