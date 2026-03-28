import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const initiativesFilePath = path.join(process.cwd(), 'database', 'initiatives.json');

function readInitiatives() {
  try {
    if (fs.existsSync(initiativesFilePath)) {
      const data = fs.readFileSync(initiativesFilePath, 'utf-8');
      return JSON.parse(data).initiatives || [];
    }
  } catch (error) {
    console.error('Error reading initiatives:', error);
  }
  return [];
}

function saveInitiatives(initiatives) {
  try {
    const dir = path.dirname(initiativesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(initiativesFilePath, JSON.stringify({ initiatives }, null, 2));
  } catch (error) {
    console.error('Error saving initiatives:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'campaigns';
    const organizerId = searchParams.get('organizerId');

    if (!organizerId) {
      return NextResponse.json({ error: 'Organizer ID required' }, { status: 400 });
    }

    // Get all initiatives from JSON
    const allInitiatives = readInitiatives();

    // Filter by type and organizer ID
    const organizerInitiatives = allInitiatives.filter(
      (item) => item.type === type && item.organizer_id === parseInt(organizerId)
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

    const initiatives = readInitiatives();

    // Generate new ID
    const newId = initiatives.length > 0 ? Math.max(...initiatives.map(i => i.id)) + 1 : 1;

    // Create new initiative
    const newInitiative = {
      id: newId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    initiatives.push(newInitiative);
    saveInitiatives(initiatives);

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
