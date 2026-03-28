import Card from '@/components/Card';
import { getInitiatives } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Workshops() {
  const workshops = await getInitiatives('workshop');

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
