import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/db';

export async function GET() {
  try {
    const campaigns = getCampaigns('campaign');
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
