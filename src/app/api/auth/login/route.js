import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'database', 'users.json');

function readUsers() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(data).users || [];
    }
  } catch (error) {
    console.error('Error reading users:', error);
  }
  return [];
}

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

    const users = readUsers();

    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (without password)
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
