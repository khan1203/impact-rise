'use client';

import { useState } from 'react';

export default function DonateModal({ campaignTitle = 'this campaign', initiativeId }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'bkash',
    transactionId: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { value: 'bkash', label: 'bKash' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'bank', label: 'DBBL Bank' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.amount) {
      setError('Please enter a donation amount');
      return;
    }

    if (!formData.transactionId.trim()) {
      setError('Please enter a transaction ID or account number');
      return;
    }

    if (Number(formData.amount) < 1) {
      setError('Donation amount must be at least BDT 1');
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
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          initiative_id: initiativeId,
          amount: Number(formData.amount),
          transaction_id: `${formData.paymentMethod.toUpperCase()}-${formData.transactionId}`,
          payment_method: formData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Donation failed');
        return;
      }

      alert(`Thank you for donating BDT ${formData.amount} via ${paymentMethods.find(m => m.value === formData.paymentMethod).label} to ${campaignTitle}.`);
      setOpen(false);
      setFormData({ paymentMethod: 'bkash', transactionId: '', amount: '' });
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-2 text-2xl font-bold">Donate</h3>
            <p className="mb-6 text-sm text-gray-600">Support {campaignTitle}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              {/* Payment Method Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction ID / Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.paymentMethod === 'bank' ? 'Bank Account Number' : 'Transaction ID'} *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder={formData.paymentMethod === 'bank' ? 'e.g., 1234567890' : 'e.g., ABC123XYZ'}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Donation Amount (BDT) *
                </label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Info Message */}
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 border border-blue-200">
                💡 Please ensure the transaction ID matches your {paymentMethods.find(m => m.value === formData.paymentMethod)?.label} transfer.
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setOpen(false)} 
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 font-medium text-white hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
