import { NextResponse } from 'next/server';
import { createInitiative, getInitiatives } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'campaigns';
    const organizerId = searchParams.get('organizerId');

    if (!organizerId) {
      return NextResponse.json({ error: 'Organizer ID required' }, { status: 400 });
    }

    const allInitiatives = await getInitiatives(type);
    const organizerInitiatives = allInitiatives.filter(
      (item) => item.organizer_id === parseInt(organizerId, 10)
    );

    return NextResponse.json({ initiatives: organizerInitiatives });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const required = ['title', 'short_description', 'description', 'date', 'expected_budget', 'organizer_id', 'organizer_name', 'type'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    const newInitiative = await createInitiative({
      ...data,
      expected_budget: Number(data.expected_budget),
      manpower: data.manpower ? Number(data.manpower) : null,
    });

    return NextResponse.json(
      { 
        message: 'Initiative created successfully',
        initiative: newInitiative
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating initiative:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
