"use client"
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sendPasswordReset } from '@supabase/auth'
import { supabase } from '../supabaseClient';

interface FormDataState {
  email: string;
  password: string;
}

// BasicSignupForm: only collects email and password for Supabase Auth
const BasicSignupForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataState>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  // --- Forgot Password Handler ---
  const handleForgotPassword = async (email: string) => {
    setError('');
    setSuccess('');
    setForgotPasswordSent(false);
    try {
      await sendPasswordReset(email);
      setForgotPasswordSent(true);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch {
      setError('Failed to send password reset email. Please try again later.');
    }
  };

  const onSubmit = async (data: FormDataState) => {
    if (!agreedToTerms) {
      setError('Please agree to the terms.');
      return;
    }
    setIsLoading(true);
    setEmailSent(false);
    setSuccess('');
    setError('');

    try {
      // Only create auth user with email and password
      const { data: signUpResult, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (signUpError) {
        // If error is about email already registered, show a friendly message
        if (signUpError.message && signUpError.message.toLowerCase().includes('email')) {
          setError('This email address is already registered. Please log in or use a different email.');
        } else {
          setError(signUpError.message || 'An error occurred during registration.');
        }
        setIsLoading(false);
        return;
      }
      const authUser = signUpResult.user;
      if (!authUser) throw new Error('Signup failed: no user returned');

      setRegisteredEmail(data.email);
      setEmailSent(true);
      setSuccess('Account created! Please check your email to verify your account before logging in.');
      setShowForgotPassword(false);
      reset();
    } catch {
      const userMessage = 'An error occurred during registration.';
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Attempt to resend verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
      });

      if (error) throw error;

      setSuccess('Verification email has been resent. Please check your inbox.');
    } catch {
      setError('Failed to resend verification email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only render email and password fields for signup
  return (
    <div className="form-container">
      <h1 className="form-title">Create Account</h1>
      {error && <div className="form-error">{error}</div>}
      {success && !emailSent && (
        <div className="form-success">{success}</div>
      )}
      {emailSent ? (
        <div className="flex flex-col items-center justify-center bg-white border border-slate-300 rounded-lg shadow-md p-6 mt-4 text-center transition-all duration-500">
          <svg className="w-12 h-12 text-green-500 mb-2 mx-auto animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
          </svg>
          <p className="text-lg font-semibold text-green-700 mb-2">Account created!</p>
          <p className="text-black mb-2">A verification email has been sent to <strong>{registeredEmail}</strong>.</p>
          <p className="text-black mb-4">Please check your inbox and click the verification link to activate your account.</p>
          <button
            onClick={handleResendEmail}
            className="btn-primary mb-2 mx-auto"
          >
            Resend Verification Email
          </button>
          <button
            onClick={() => (window.location.href = '/login')}
            className="btn-secondary mx-auto"
          >
            Login now
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="form-section">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-input"
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, // at least one upper, lower, number, symbol
                  message: 'Must include uppercase, lowercase, number, and symbol',
                },
              })}
              aria-describedby="passwordHelp"
            />
            <p id="passwordHelp" className="text-xs text-gray-500 mt-1">
              Min 8 chars, incl. uppercase, lowercase, number, symbol (!@#$%^&*).
            </p>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="form-checkbox mt-1"
            />
            <label htmlFor="terms" className="form-label">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="form-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="form-link">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          <div className="flex items-center justify-center pt-3">
            <button type="submit" className="btn-primary" disabled={isLoading || !agreedToTerms}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
      {/* Password reset UI (optional, can be toggled with showForgotPassword if needed) */}
      {showForgotPassword && (
        <div className="form-section mt-4">
          <h2 className="form-title">Reset Password</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (formRef.current?.elements.namedItem('email') as HTMLInputElement)?.value;
              if (email) await handleForgotPassword(email);
            }}
          >
            <input
              className="form-input"
              type="email"
              name="resetEmail"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn-primary mt-2">
              Send Reset Email
            </button>
          </form>
          {forgotPasswordSent && <div className="form-success mt-2">Password reset email sent!</div>}
        </div>
      )}
    </div>
  );
};

export default BasicSignupForm;
