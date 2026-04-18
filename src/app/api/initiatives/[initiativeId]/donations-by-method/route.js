import { NextResponse } from 'next/server';
import { getDonationsByPaymentMethod } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { initiativeId } = params;

    if (!initiativeId) {
      return NextResponse.json(
        { error: 'Initiative ID required' },
        { status: 400 }
      );
    }

    const donations = await getDonationsByPaymentMethod(initiativeId);

    return NextResponse.json(donations, { status: 200 });
  } catch (error) {
    console.error('Error fetching donations by payment method:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
