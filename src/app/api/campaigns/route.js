import { NextResponse } from 'next/server';
import { getInitiatives } from '@/lib/db';

export async function GET() {
  try {
    const campaigns = await getInitiatives('campaign');
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
