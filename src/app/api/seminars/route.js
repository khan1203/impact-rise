import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/db';

export async function GET() {
  try {
    const seminars = getCampaigns('seminar');
    return NextResponse.json(seminars);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
