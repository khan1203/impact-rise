import { NextResponse } from 'next/server';
import { readVolunteers, readInitiatives, readUsers } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get('organizerId');

    if (!organizerId) {
      return NextResponse.json(
        { error: 'Organizer ID is required' },
        { status: 400 }
      );
    }

    const volunteers = readVolunteers();
    const initiatives = readInitiatives();
    const users = readUsers();

    // Get all initiatives for this organizer
    const organizerInitiatives = initiatives.filter(
      i => i.organizerId === Number(organizerId)
    );

    const initiativeIds = organizerInitiatives.map(i => i.id);

    // Get all volunteers for these initiatives
    const organizerVolunteers = volunteers
      .filter(v => initiativeIds.includes(v.initiativeId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(v => {
        const initiative = organizerInitiatives.find(i => i.id === v.initiativeId);
        const user = users.find(u => u.id === v.userId);
        
        return {
          id: v.id,
          user_id: v.userId,
          initiative_id: v.initiativeId,
          initiative_title: initiative?.title || 'Unknown Initiative',
          name: v.name,
          present_location: v.presentLocation,
          profession: v.profession,
          contributing_skill: v.contributingSkill,
          whatsapp_number: v.whatsappNumber,
          status: v.status || 'pending',
          created_at: v.createdAt,
          user_email: user?.email || 'N/A',
        };
      });

    return NextResponse.json({
      success: true,
      volunteers: organizerVolunteers,
    });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}
