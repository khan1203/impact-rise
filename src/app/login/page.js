'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Validate user exists in database
      if (!data.user) {
        setError('User not found in database');
        setLoading(false);
        return;
      }

      // Save user data to localStorage
      const userData = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        userType: data.user.userType,
        role: data.user.role,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event('userLoggedIn'));

      // Redirect to appropriate dashboard based on userType
      const dashboardPath = data.user.userType?.toLowerCase() === 'organizer' 
        ? '/dashboard/organizer' 
        : '/dashboard/user';
      
      router.push(dashboardPath);
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-600 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your ImpactRise account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-600" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <Link href="#" className="text-sky-600 hover:text-sky-700 font-semibold">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">New to ImpactRise?</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/register"
            className="w-full py-3 px-4 bg-white text-sky-600 font-semibold rounded-lg border-2 border-sky-600 hover:bg-sky-50 transition duration-300 inline-block text-center"
          >
            Create Account
          </Link>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Want to learn more?{' '}
            <Link href="/" className="text-sky-600 hover:text-sky-700 font-semibold">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
