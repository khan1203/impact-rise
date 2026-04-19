import Image from 'next/image';
import { Clock, Users, DollarSign, Award } from 'lucide-react';
import DonateModal from '@/components/DonateModal';
import VolunteerModal from '@/components/VolunteerModal';
import { getInitiativeById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CampaignDetail({ params }) {
  const campaign = await getInitiativeById(params.id);

  if (!campaign || campaign.type !== 'campaign') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Campaign not found</h1>
          <p className="text-gray-600">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-sky-100">
          <div className="relative h-96">
            <Image src={campaign.banner_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'} alt={campaign.title} fill className="object-cover" />
          </div>

          <div className="p-8">
            <h1 className="mb-6 text-4xl font-bold text-sky-700">{campaign.title}</h1>

            <div className="mb-8 grid gap-6 rounded-xl bg-sky-50 p-6 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold">
                    {campaign.date} at {campaign.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Manpower Needed</p>
                  <p className="font-semibold">{campaign.manpower} volunteers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Expected Budget</p>
                  <p className="font-semibold">৳{campaign.expected_budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="text-sm text-gray-600">Organizer</p>
                  <p className="font-semibold">{campaign.organizer_name}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <p className="leading-relaxed text-gray-600">{campaign.description}</p>
            </div>

            <div className="mb-6 rounded-xl bg-sky-50 p-6">
              <h3 className="mb-4 font-bold text-sky-700">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Bank Account:</strong> {campaign.bank_account}
                </p>
                <p>
                  <strong>bKash:</strong> {campaign.bkash_number}
                </p>
                <p>
                  <strong>Nagad:</strong> {campaign.nagad_number}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DonateModal campaignTitle={campaign.title} initiativeId={campaign.id} />
              <VolunteerModal initiativeTitle={campaign.title} initiativeId={campaign.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
