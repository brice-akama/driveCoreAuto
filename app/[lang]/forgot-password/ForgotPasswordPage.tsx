'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumbs';
import { useLanguage } from '@/app/context/LanguageContext';

interface ForgotPasswordPageProps {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  initialLanguage,
  initialTranslations,
}) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language and translations
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, 'forgotPassword');
  }, [initialLanguage, setLanguage]);

  // Use SSR translations initially, fallback to context translations
  const t = translations || initialTranslations || {};

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || (t['errorMessage'] ?? 'An error occurred'));

      } else {
        setMessage(data.message || (t['successMessage'] ?? 'Success! Please check your email.'));
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage(t['errorMessage'] ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 lg:mt-40">
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{t['forgotPasswordTitle'] ?? 'Forgot Password'}</h1>
        <Breadcrumb />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">{t['forgotPasswordTitle'] ?? 'Forgot Password'}</h1>
          <p className="text-sm text-gray-600 text-center">{t['forgotPasswordDesc'] ?? ''}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t['emailLabel'] ?? 'Email'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder={t['emailPlaceholder'] ?? 'Enter your email'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              {loading ? t['sending'] ?? 'Sending...' : t['sendReset'] ?? 'Send Reset Link'}
            </button>
          </form>

          {message && (
            <p
              className={`text-sm text-center mt-2 ${isError ? 'text-red-600' : 'text-green-600'}`}
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <p className="text-sm text-center text-gray-500">
            {t['rememberPassword'] ?? 'Remember your password?'}{' '}
            <Link href={`/${language ?? 'en'}/profile`} className="text-blue-600 underline hover:text-blue-700">
              {t['login'] ?? 'Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
