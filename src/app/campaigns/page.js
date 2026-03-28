import Card from '@/components/Card';
import { getInitiatives } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Campaigns() {
  const campaigns = await getInitiatives('campaign');

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
