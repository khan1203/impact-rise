import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/db';

export async function GET() {
  try {
    const workshops = getCampaigns('workshop');
    return NextResponse.json(workshops);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
