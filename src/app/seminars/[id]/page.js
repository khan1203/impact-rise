import Image from 'next/image';
import { Clock, Users, DollarSign, Award } from 'lucide-react';
import DonateModal from '@/components/DonateModal';
import VolunteerModal from '@/components/VolunteerModal';
import { getInitiativeById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SeminarDetail({ params }) {
  const seminar = await getInitiativeById(params.id);

  if (!seminar || seminar.type !== 'seminar') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Seminar not found</h1>
          <p className="text-gray-600">The seminar you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-sky-100">
          <div className="relative h-96">
            <Image src={seminar.banner_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'} alt={seminar.title} fill className="object-cover" />
          </div>
          <div className="p-8">
            <h1 className="mb-6 text-4xl font-bold text-sky-700">{seminar.title}</h1>
            <div className="mb-8 grid gap-6 rounded-xl bg-sky-50 p-6 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold">
                    {seminar.date} at {seminar.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Expected Attendees</p>
                  <p className="font-semibold">{seminar.manpower}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Expected Budget</p>
                  <p className="font-semibold">৳{seminar.expected_budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Organizer</p>
                  <p className="font-semibold">{seminar.organizer_name}</p>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <p className="mb-6 leading-relaxed text-gray-600">{seminar.description}</p>
            </div>
            <div className="mb-6 rounded-xl bg-sky-50 p-6">
              <h3 className="mb-4 font-bold text-sky-700">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Bank Account:</strong> {seminar.bank_account}
                </p>
                <p>
                  <strong>bKash:</strong> {seminar.bkash_number}
                </p>
                <p>
                  <strong>Nagad:</strong> {seminar.nagad_number}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DonateModal campaignTitle={seminar.title} initiativeId={seminar.id} />
              <VolunteerModal initiativeTitle={seminar.title} initiativeId={seminar.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
