import Card from '@/components/Card';

// Mock data
const mockWorkshops = [
  {
    id: 3,
    title: 'Leadership Workshop',
    short_description: 'Building future leaders',
    description: 'Intensive workshop on youth leadership development',
    banner_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    date: '2026-06-10',
    time: '2:00 PM',
    manpower: 20,
    expected_budget: 80000,
    organizer_id: 1,
    organizer_name: 'Admin User',
    bank_account: '1234567890',
    bkash_number: '01712345678',
    nagad_number: '01812345678',
    type: 'workshop',
  },
];

export default function Workshops() {
  const workshops = mockWorkshops;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-sky-600">
          Workshops
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {workshops.length > 0 ? (
            workshops.map((workshop) => (
              <Card key={workshop.id} item={workshop} type="workshops" />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No workshops available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
