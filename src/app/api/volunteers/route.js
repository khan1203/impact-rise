import { NextResponse } from 'next/server';
import { createVolunteer } from '@/lib/db';

export async function POST(request) {
  try {
    const { user_id, initiative_id, name, present_location, profession, contributing_skill, whatsapp_number } = await request.json();

    // Validation
    if (!user_id || !initiative_id || !name || !present_location || !profession || !contributing_skill || !whatsapp_number) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const volunteer = await createVolunteer({
      user_id,
      initiative_id,
      name,
      present_location,
      profession,
      contributing_skill,
      whatsapp_number,
    });

    return NextResponse.json(
      {
        success: true,
        volunteer,
        message: 'Volunteer request submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Volunteer error:', error);
    return NextResponse.json(
      { error: 'Failed to submit volunteer request' },
      { status: 500 }
    );
  }
}
