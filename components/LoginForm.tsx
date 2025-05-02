import React, { useState } from 'react';
import { loginUser } from '../lib/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    try {
      await loginUser(email, password);
      // redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch {
      setError('Login failed. Please ensure you have signed up email is verified and try again.');
    }
  }

  async function handlePasswordReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() || '';

    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Failed to send password reset email. Please check your email address and try again.');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-default">{isResetMode ? 'Reset Password' : 'Login'}</h1>
      {error && <p className="text-red-600 dark:text-red-400 mb-4 text-center">{error}</p>}
      {resetSent && (
        <p className="text-green-600 dark:text-green-400 mb-4 text-center">
          Password reset email sent! Check your inbox.
        </p>
      )}
      <form onSubmit={isResetMode ? handlePasswordReset : handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-default mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-600"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        {!isResetMode && (
          <div>
            <label className="block font-semibold text-default mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-600"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-primary text-accent rounded py-2 px-4 hover:bg-secondary transition duration-300"
        >
          {isResetMode ? 'Send Reset Link' : 'Login'}
        </button>
        <div className="text-center mt-4 space-y-2">
          <button
            onClick={() => {
              setIsResetMode(!isResetMode);
              setError('');
              setResetSent(false);
            }}
            type="button"
            className="text-primary hover:text-secondary text-sm"
          >
            {isResetMode ? 'Back to Login' : 'Forgot password?'}
          </button>
          {!isResetMode && (
            <div>
              <span className="text-black">Don't have an account? </span>
              <span></span>
              <a href="/signup" className="text-highlight text-hover:text-secondary">
                <strong> Sign up </strong>{' '}
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
