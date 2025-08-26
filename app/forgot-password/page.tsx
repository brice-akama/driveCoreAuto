'use client';

import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs';
import Link from 'next/link';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || 'Check your email for reset instructions.');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 lg:mt-40">
              {/* Full-width black section */}
              <div className="bg-black text-white py-8 text-center w-full">
                <h1 className="text-4xl font-black">Forgot Password</h1>
        
                <Breadcrumb />
              </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your email below and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p className="text-sm text-center text-gray-700 mt-2">{message}</p>
        )}

        <p className="text-sm text-center text-gray-500">
          Remembered your password?{' '}
          <Link href="/profile" className="text-blue-600 underline hover:text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default ForgotPasswordPage;
