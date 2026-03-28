import { NextResponse } from 'next/server';
import { getDonationSummaryByUser } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const donations = await getDonationSummaryByUser(params.id);

    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const supportedCount = new Set(donations.map((donation) => donation.campaign_id)).size;

    return NextResponse.json({
      donations,
      stats: {
        totalAmount,
        donationsCount: donations.length,
        supportedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
