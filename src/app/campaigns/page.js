import Card from '@/components/Card';

// Mock data - replace with database call when ready
const mockCampaigns = [
  {
    id: 1,
    title: 'Digital Literacy Program',
    short_description: 'Empowering rural youth with tech skills',
    description: 'A comprehensive program to teach digital literacy to rural youth',
    banner_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    date: '2026-04-15',
    time: '10:00 AM',
    manpower: 25,
    expected_budget: 150000,
    organizer_id: 1,
    organizer_name: 'Admin User',
    bank_account: '1234567890',
    bkash_number: '01712345678',
    nagad_number: '01812345678',
    type: 'campaign',
  },
];

export default function Campaigns() {
  const campaigns = mockCampaigns;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-sky-600">
          Campaigns
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <Card key={campaign.id} item={campaign} type="campaigns" />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No campaigns available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
