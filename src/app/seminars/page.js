import Card from '@/components/Card';
import { getInitiatives } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Seminars() {
  const seminars = await getInitiatives('seminar');

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
