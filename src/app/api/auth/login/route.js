import { getUserByEmail } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email, { includePassword: true });

    if (!user || user.password !== password) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful!'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
