import { NextResponse } from 'next/server';
import { deleteInitiative, updateInitiative } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const initiative = await updateInitiative(id, {
      ...data,
      expected_budget: Number(data.expected_budget),
      manpower: data.manpower ? Number(data.manpower) : null,
    });

    return NextResponse.json({ 
      message: 'Initiative updated successfully',
      initiative
    });
  } catch (error) {
    console.error('Error updating initiative:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await deleteInitiative(id);

    return NextResponse.json({ message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
