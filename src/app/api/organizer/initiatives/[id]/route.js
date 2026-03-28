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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const initiatives = readInitiatives();
    const index = initiatives.findIndex(i => i.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }

    // Update initiative while preserving created_at
    initiatives[index] = {
      ...initiatives[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    saveInitiatives(initiatives);

    return NextResponse.json({ 
      message: 'Initiative updated successfully',
      initiative: initiatives[index]
    });
  } catch (error) {
    console.error('Error updating initiative:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const initiatives = readInitiatives();
    const index = initiatives.findIndex(i => i.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json({ error: 'Initiative not found' }, { status: 404 });
    }

    // Remove initiative
    initiatives.splice(index, 1);
    saveInitiatives(initiatives);

    return NextResponse.json({ message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
