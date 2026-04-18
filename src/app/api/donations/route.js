import { NextResponse } from 'next/server';
import { createDonation } from '@/lib/db';

export async function POST(request) {
  try {
    const { user_id, initiative_id, amount, transaction_id, payment_method } = await request.json();

    if (!user_id || !initiative_id || !amount) {
      return NextResponse.json(
        { error: 'user_id, initiative_id, and amount are required' },
        { status: 400 }
      );
    }

    const donation = await createDonation({
      user_id,
      initiative_id,
      amount,
      transaction_id: transaction_id || `TXN-${Date.now()}`,
      payment_method: payment_method || 'unknown',
    });

    return NextResponse.json(
      {
        success: true,
        donation,
        message: 'Donation recorded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ error: 'Donation failed' }, { status: 500 });
  }
}
