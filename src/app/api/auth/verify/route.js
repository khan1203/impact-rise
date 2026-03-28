import { getUserByEmail } from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return Response.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user,
      message: 'User verified!'
    }, { status: 200 });

  } catch (error) {
    console.error('Verification error:', error);
    return Response.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
