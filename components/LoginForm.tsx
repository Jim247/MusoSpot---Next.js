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
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Failed to send password reset email. Please check your email address and try again.');
    }
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

        <button
          type="submit"
          className="btn-primary w-full"
        >
          {isResetMode ? 'Send Reset Link' : 'Login'}
        </button>

        <div className="form-nav">
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
          
          {!isResetMode && (
            <div className="text-gray-600 dark:text-gray-400">
              <span>Don't have an account? </span>
              <a href="/signup" className="form-link font-semibold">
                Sign up
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
