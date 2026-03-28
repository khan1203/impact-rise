import fs from 'fs';
import path from 'path';

// Simple in-memory user storage (will be replaced with proper SQLite later)
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

function saveUsers(users) {
  try {
    const dir = path.dirname(usersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

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

    const users = readUsers();

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2,
      email,
      password, // In production, hash this with bcrypt
      firstName,
      lastName,
      userType: userType || 'donor',
      role: 'user',
      created_at: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    saveUsers(users);

    // Return success (don't send password back)
    const { password: _, ...userWithoutPassword } = newUser;
    return Response.json({
      success: true,
      user: userWithoutPassword,
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
