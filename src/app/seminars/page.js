import Card from '@/components/Card';

// Mock data
const mockSeminars = [
  {
    id: 2,
    title: 'Climate Action Summit',
    short_description: 'Youth-led environmental awareness',
    description: 'A seminar on climate change and sustainable solutions',
    banner_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    date: '2026-05-20',
    time: '9:00 AM',
    manpower: 40,
    expected_budget: 200000,
    organizer_id: 1,
    organizer_name: 'Admin User',
    bank_account: '1234567890',
    bkash_number: '01712345678',
    nagad_number: '01812345678',
    type: 'seminar',
  },
];

export default function Seminars() {
  const seminars = mockSeminars;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-sky-600">
          Seminars
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {seminars.length > 0 ? (
            seminars.map((seminar) => (
              <Card key={seminar.id} item={seminar} type="seminars" />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No seminars available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
