import React, { useState } from 'react';
import { loginUser, sendPasswordReset } from '@supabase/auth';
import { supabase } from '../supabaseClient';
import PostValidationSignup from './PostValidationSignup';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [showValidatedSignup, setShowValidatedSignup] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    try {
      await loginUser(email, password);
      // After login, check if user row exists in users table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRow, error: userRowError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        // Check for required fields (customize as needed)
        const requiredFields = ['first_name', 'last_name', 'role', 'postcode', 'phone'];
        let missingFields = [];
        if (!userRow || !userRowError) {
          // No user row: check for pending profile in localStorage
          const pending = typeof window !== 'undefined' ? localStorage.getItem('pendingProfile') : null;
          if (pending) {
            setPendingProfile(JSON.parse(pending));
            setShowValidatedSignup(true);
            return;
          } else {
            // No pending profile, create minimal row and prompt to complete profile
            await supabase.from('users').insert([
              { id: user.id, email: user.email }
            ]);
            setShowValidatedSignup(true);
            return;
          }
        } else {
          // User row exists, check for missing required fields
          missingFields = requiredFields.filter(f => !userRow[f]);
          if (missingFields.length > 0) {
            setPendingProfile(userRow);
            setShowValidatedSignup(true);
            return;
          }
        }
      }
      window.location.href = '/dashboard';
    } catch {
      setError('Login failed. Please ensure you have signed up, and that your email is verified and try again.');
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
      await sendPasswordReset(email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Failed to send password reset email. Please check your email address and try again.');
    }
  }

  if (showValidatedSignup) {
    return <PostValidationSignup initialProfile={pendingProfile || {}} />;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">
        {isResetMode ? 'Reset Password' : 'Login'}
      </h1>
      
      {error && <div className="form-error">{error}</div>}
      {resetSent && (
        <div className="form-success">
          Password reset email sent! Check your inbox.
        </div>
      )}

      <form onSubmit={isResetMode ? handlePasswordReset : handleSubmit} className="form-section">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>

        {!isResetMode && (
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
        )}

        <div className='mb-4'>
        <button
          type="submit"
          className="btn-primary w-full"
        >
          {isResetMode ? 'Send Reset Link' : 'Login'}
        </button>
        </div>

        <div className="form-nav flex flex-col">
          <div>
            <button
              onClick={() => {
                setIsResetMode(!isResetMode);
                setError('');
                setResetSent(false);
              }}
              type="button"
              className="form-link text-sm"
            >
              {isResetMode ? 'Back to Login' : 'Forgot password?'}
            </button>
          </div>
          {!isResetMode && (
            <div className="text-gray-600 mt-2">
              <span>Don&apos;t have an account? </span>
              <div className='flex flex-col items-center'>
              <a href="/signup" className="form-link font-semibold">
                Sign up
              </a>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;