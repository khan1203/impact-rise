import { createUser, getUserByEmail } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, userType } = await request.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      email,
      password,
      firstName,
      lastName,
      userType: userType || 'donor',
      role: 'user',
    });

    return Response.json({
      success: true,
      user: newUser,
      message: 'Registration successful!'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
