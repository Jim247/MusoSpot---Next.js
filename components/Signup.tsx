"use client"
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createUser, generateUsername } from '../lib/firebase';
import { INSTRUMENTS } from '../constants/instruments';
import { postcodeToGeoPoint } from '../lib/postcodeUtils';
import { postcodeValidator } from 'postcode-validator';
import { sendPasswordResetEmail, getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import PostcodeAutocomplete from '../lib/ValidatePostcode';

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  agencyName?: string;
  instrument?: string;
  yearsExperience?: string;
  postcode: string;
  phone: string;
  transport: string;
  paSystem: string;
  lighting: string;
}

const BasicSignupForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
    control,
  } = useForm<FormDataState>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'musician',
      agencyName: '',
      instrument: '',
      yearsExperience: '',
      postcode: '',
      phone: '',
      transport: '',
      paSystem: '',
      lighting: '',
    },
    mode: 'onBlur',
  });

  const role = watch('role');
  const postcode = watch('postcode');
  const phone = watch('phone');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const email = watch('email');

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError('');
    if (currentStep === 1) {
      const valid = await trigger(['firstName', 'lastName', 'email', 'password', 'confirmPassword']);
      if (!valid) return false;
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    } else if (currentStep === 2) {
      if (role === 'musician') {
        const valid = await trigger(['instrument', 'yearsExperience', 'transport', 'paSystem', 'lighting']);
        if (!valid) return false;
      } else if (role === 'agent') {
        const valid = await trigger(['agencyName']);
        if (!valid) return false;
      }
    } else if (currentStep === 3) {
      const valid = await trigger(['postcode', 'phone']);
      if (!valid) return false;
      const rawPostcode = postcode?.toUpperCase();
      if (!postcodeValidator(rawPostcode, 'GB')) {
        setError('Please enter a valid UK postcode.');
        return false;
      }
      const phonePattern = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
      if (!phonePattern.test(phone || '')) {
        setError('Please enter a valid UK mobile number.');
        return false;
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    setForgotPasswordSent(false);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordSent(true);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Failed to send password reset email. Please try again later.');
      }
    }
  };

  const onSubmit = async (data: FormDataState) => {
    if (!agreedToTerms) {
      setError('Please agree to the terms.');
      setStep(4);
      return;
    }
    setIsLoading(true);
    setEmailSent(false);
    setSuccess('');
    setError('');

    try {
      // Check if email already exists
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, data.email);
      if (signInMethods && signInMethods.length > 0) {
        setError('This email address is already registered. Please use a different email or log in.');
        setShowForgotPassword(true);
        setStep(1);
        setIsLoading(false);
        return;
      }

      const rawPostcode = data.postcode.toUpperCase();
      const cleaned = rawPostcode.replace(/\s+/g, '');
      const formattedPostcode = cleaned.replace(/^(.+?)(\d[A-Z]{2})$/, '$1 $2');

      const geoPoint = await postcodeToGeoPoint(formattedPostcode);
      if (!geoPoint) {
        setError('Could not validate postcode location. Please check your postcode.');
        setIsLoading(false);
        setStep(3);
        return;
      }

      const username = await generateUsername(data.firstName, data.lastName);

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        username,
        role: data.role,
        instrument: data.role === 'musician' ? data.instrument : undefined,
        agencyName: data.role === 'agent' ? data.agencyName : undefined,
        yearsExperience: data.role === 'musician' ? data.yearsExperience : undefined,
        postcode: formattedPostcode,
        geoPoint,
        slug: username,
        transport: data.role === 'musician' ? data.transport === 'yes' : undefined,
        paSystem: data.role === 'musician' ? data.paSystem === 'yes' : undefined,
        lighting: data.role === 'musician' ? data.lighting === 'yes' : undefined,
      };

      await createUser(data.email, data.password, userData);

      setRegisteredEmail(data.email);
      setEmailSent(true);
      setSuccess('Account created! Please check your email to verify your account before logging in.');
      setShowForgotPassword(false);
      reset();
    } catch (err) {
      let userMessage = 'An error occurred during registration.';
      if (err.code === 'auth/email-already-in-use') {
        userMessage = 'This email address is already registered. Please use a different email or log in.';
        setShowForgotPassword(true);
        setStep(1);
      } else if (err.code === 'auth/invalid-email') {
        userMessage = 'The email address provided is invalid.';
        setStep(1);
      } else if (err.code === 'auth/weak-password') {
        userMessage = 'Password is too weak. Please choose a stronger password.';
        setStep(1);
      }
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendVerificationEmail();
      setSuccess('Verification email has been resent!');
    } catch {
      setError('Failed to resend verification email. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 ml-3 text-center">
        Create Account {step < 4 ? `(Step ${step} of 4)` : ''}
      </h1>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}
      {success && !emailSent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{success}</div>
      )}

      {emailSent ? (
        <div className="text-center items">
          <p className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{success}</p>
          <p className="mb-4">
            A verification email has been sent to <strong>{registeredEmail}</strong>.
          </p>
          <p className="mb-4">Please check your inbox and click the verification link to activate your account.</p>
          <button
            onClick={handleResendEmail}
            className="mt-3 py-2 px-4 bg-highlight hover:bg-hover text-white font-semibold rounded"
          >
            Resend Verification Email
          </button>
          <div className="mt-2">
            <button
              onClick={() => (window.location.href = '/login')}
              className="mt-2 py-2 px-4 bg-white *:hover:bg-hover text-black font-semibold margin-left-2 rounded border border-gray-300"
            >
              Login now
            </button>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    id="lastName"
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
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
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                      message: 'Must include uppercase, lowercase, number, and symbol',
                    },
                  })}
                  aria-describedby="passwordHelp"
                />
                <p id="passwordHelp" className="text-xs text-gray-500 mt-1">
                  Min 8 chars, incl. uppercase, lowercase, number, symbol (!@#$%^&*).
                </p>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
              {showForgotPassword && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="text-blue-600 underline text-sm"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordSent}
                  >
                    Forgot Password?
                  </button>
                  {forgotPasswordSent && <div className="text-green-600 text-xs mt-1">Password reset email sent!</div>}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block font-semibold mb-2" htmlFor="role">
                  Are you a musician or an agent?
                </label>
                <select className="w-full border rounded px-3 py-2" id="role" {...register('role', { required: true })}>
                  <option value="musician">Musician</option>
                  <option value="agent">Agent</option>
                </select>
              </div>

              {role === 'agent' && (
                <div>
                  <label className="block font-semibold mb-2" htmlFor="agencyName">
                    Agency Name
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    id="agencyName"
                    {...register('agencyName', { required: 'Agency name is required' })}
                  />
                  {errors.agencyName && <p className="text-red-500 text-sm mt-1">{errors.agencyName.message}</p>}
                </div>
              )}

              {role === 'musician' && (
                <>
                  <div>
                    <label className="block font-semibold mb-2" htmlFor="instrument">
                      Primary Instrument
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      id="instrument"
                      {...register('instrument', { required: 'Instrument is required' })}
                    >
                      <option value="">Select your instrument</option>
                      {INSTRUMENTS.map((inst) => (
                        <option key={inst} value={inst}>
                          {inst}
                        </option>
                      ))}
                    </select>
                    {errors.instrument && <p className="text-red-500 text-sm mt-1">{errors.instrument.message}</p>}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2" htmlFor="yearsExperience">
                      Years Of Professional Experience
                    </label>
                    <input
                      className="w-full border rounded px-3 py-2"
                      type="number"
                      id="yearsExperience"
                      {...register('yearsExperience', { required: 'Years of experience is required', min: 0, max: 70 })}
                    />
                    {errors.yearsExperience && (
                      <p className="text-red-500 text-sm mt-1">{errors.yearsExperience.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2" htmlFor="transport">
                      Do you have your own transport?
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      id="transport"
                      {...register('transport', { required: 'Please specify transport' })}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.transport && <p className="text-red-500 text-sm mt-1">{errors.transport.message}</p>}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2" htmlFor="paSystem">
                      Do you have your own PA system?
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      id="paSystem"
                      {...register('paSystem', { required: 'Please specify PA system' })}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.paSystem && <p className="text-red-500 text-sm mt-1">{errors.paSystem.message}</p>}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2" htmlFor="lighting">
                      Do you have your own lighting?
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      id="lighting"
                      {...register('lighting', { required: 'Please specify lighting' })}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.lighting && <p className="text-red-500 text-sm mt-1">{errors.lighting.message}</p>}
                  </div>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block font-semibold mb-2" htmlFor="postcode">
                  Postcode
                </label>
                {/* Use Controller for custom input component */}
                <Controller
                  name="postcode"
                  control={control}
                  rules={{ required: 'Postcode is required' }}
                  render={({ field }) => (
                    <PostcodeAutocomplete {...field} value={field.value} onChange={field.onChange} required />
                  )}
                />
                {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>}
              </div>
              <div>
                <label className="block font-semibold mb-2" htmlFor="phone">
                  Mobile Phone
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="tel"
                  id="phone"
                  {...register('phone', { required: 'Phone is required' })}
                  placeholder="e.g. 07123 456789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-highlight border-gray-300 rounded bg-pink-700"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-highlight hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-highlight hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          )}

          <div className="flex justify-center pt-4">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary w-1/2">
                Back
              </button>
            )}
            {step === 1 && <div />}

            {step < 4 && (
              <button type="button" onClick={nextStep} className="btn btn-primary w-1/2 mx-6">
                Next
              </button>
            )}

            {step === 4 && (
              <button type="submit" className="btn btn-primary w-1/2 mx-6" disabled={isLoading || !agreedToTerms}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default BasicSignupForm;
