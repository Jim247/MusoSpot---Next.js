// Use client
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { INSTRUMENTS } from '../constants/instruments';
import { postcodeValidator } from 'postcode-validator';
import PostcodeAutocomplete from '@utils/ValidatePostcode';
import { postcodeToGeoPoint } from '../utils/postcodeUtils'

interface ProfileFields {
  first_name: string;
  last_name: string;
  role: string;
  agency_name?: string;
  instruments?: string;
  years_experience?: string;
  postcode: string;
  phone: string;
  transport: string;
  pa_system: string;
  lighting: string;
  
}

// Utility to generate a username from first and last name
function generateUserName(first: string, last: string) {
  // Lowercase, remove non-alphanumeric, join with dot, and trim
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${clean(first)}.${clean(last)}`;
}

const PostValidationSignup: React.FC<{ initialProfile?: Partial<ProfileFields> }> = () => {
  // Always start with empty fields, no caching of previous fields
  const [fields, setFields] = useState<ProfileFields>({
    first_name: '',
    last_name: '',
    role: 'musician',
    agency_name: '',
    instruments: '',
    years_experience: '',
    postcode: '',
    phone: '',
    transport: '',
    pa_system: '',
    lighting: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError('');
    if (currentStep === 1) {
      if (!fields.first_name || !fields.last_name) {
        setError('First and last name are required.');
        return false;
      }
    } else if (currentStep === 2) {
      if (fields.role === 'musician') {
        if (!fields.instruments || !fields.years_experience || !fields.transport || !fields.pa_system || !fields.lighting) {
          setError('All musician fields are required.');
          return false;
        }
      } else if (fields.role === 'agent') {
        if (!fields.agency_name) {
          setError('Agency name is required.');
          return false;
        }
      }
    } else if (currentStep === 3) {
      if (!fields.postcode || !fields.phone) {
        setError('Postcode and phone are required.');
        return false;
      }
      const rawPostcode = fields.postcode?.toUpperCase();
      if (!postcodeValidator(rawPostcode, 'GB')) {
        setError('Please enter a valid UK postcode.');
        return false;
      }
      // Validate postcode location with geoPoint
      const formattedPostcode = rawPostcode.replace(/\s+/g, '');
      const geoPoint = await postcodeToGeoPoint(formattedPostcode);
      if (!geoPoint) {
        setError('Could not validate postcode location. Please check your postcode.');
        setIsLoading(false);
        setStep(3);
        return false;
      }
      const phonePattern = /^\+44\s?7\d{3}|\(?07\d{3}\)?\s?\d{3}\s?\d{3}$/;
      if (!phonePattern.test(fields.phone || '')) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleValidatedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(await validateStep(step))) return;
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const username = generateUserName(fields.first_name, fields.last_name);
      const formattedPostcode = fields.postcode.toUpperCase().replace(/\s+/g, '');
      const geoPoint = await postcodeToGeoPoint(formattedPostcode);
      const userData = {
        id: user.id,
        email: user.email,
        ...fields,
        instruments: fields.instruments ? [fields.instruments] : [], // Always an array, always called instruments
        username, // Add generated username
        geopoint: geoPoint?.geopoint || null, // Use the GeoJSON Point object
        ward: geoPoint?.ward,
        region: geoPoint?.region,
        country: geoPoint?.country,
        profile_complete: true, // Set the complete flag on successful profile completion
      };
      console.log('Upserting userData:', userData); // Debug log
      const { data, error: upsertError } = await supabase
        .from('users')
        .upsert([
          userData,
        ], { onConflict: 'id' });
      console.log('Supabase upsert response:', data, upsertError); // Debug log
      if (upsertError) {
        setError(upsertError.message);
        setIsLoading(false);
        return;
      }
      setSuccess('Profile completed, you will be redicrected shortly!');
      setTimeout(() => {
        window.location.href = '/edit-profile';
      }, 1500); // Show message for 1.5s, then redirect
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setIsLoading(false);
      console.error('Profile upsert error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Complete Your Profile<br /><span className="block text-base font-normal mt-2">Step {step} of 3</span></h1>
      {error && (
        <div className="form-error" style={{ margin: '24px 0', padding: '12px', background: '#fff0f0', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: 500, fontSize: '1.1em', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="form-success" style={{ margin: '24px 0', padding: '12px', background: '#f0fff4', color: '#047857', border: '1px solid #6ee7b7', borderRadius: '6px', fontWeight: 500, fontSize: '1.1em', textAlign: 'center' }}>
          {success}
        </div>
      )}
      <form ref={undefined} onSubmit={handleValidatedSubmit} className="form-section">
        {step === 1 && (
          <>
            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="first_name">First Name</label>
                <input className="form-input" type="text" id="first_name" name="first_name" value={fields.first_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="last_name">Last Name</label>
                <input className="form-input" type="text" id="last_name" name="last_name" value={fields.last_name} onChange={handleChange} required />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Are you a musician or an agent?</label>
              <select className="form-select" id="role" name="role" value={fields.role} onChange={handleChange} required>
                <option value="musician">Musician</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            {fields.role === 'agent' && (
              <div className="form-group">
                <label className="form-label" htmlFor="agency_name">Agency Name</label>
                <input className="form-input" type="text" id="agency_name" name="agency_name" value={fields.agency_name} onChange={handleChange} required />
              </div>
            )}
            {fields.role === 'musician' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="instruments">Primary Instrument</label>
                  <select className="form-select" id="instruments" name="instruments" value={fields.instruments} onChange={handleChange} required>
                    <option value="">Select your instrument</option>
                    {INSTRUMENTS.map((inst) => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="years_experience">Years Of Professional Experience</label>
                  <input className="form-input" type="number" id="years_experience" name="years_experience" value={fields.years_experience} onChange={handleChange} min={0} max={50} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="transport">Do you have your own transport?</label>
                  <select className="form-select" id="transport" name="transport" value={fields.transport} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pa_system">Do you have your own PA system?</label>
                  <select className="form-select" id="pa_system" name="pa_system" value={fields.pa_system} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lighting">Do you have your own lighting?</label>
                  <select className="form-select" id="lighting" name="lighting" value={fields.lighting} onChange={handleChange} required>
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}
        {step === 3 && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="postcode">Postcode</label>
              <PostcodeAutocomplete value={fields.postcode} onChange={(val: string) => setFields(f => ({ ...f, postcode: val }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Mobile Phone</label>
              <input className="form-input" type="tel" id="phone" name="phone" value={fields.phone} onChange={handleChange} placeholder="e.g. 07123 456789" required />
            </div>
          </>
        )}
        <div className="flex items-center justify-center pt-3 space-x-4">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={prevStep}>Back</button>
          )}
          {step < 3 && (
            <button type="button" className="btn-primary" onClick={nextStep}>Next</button>
          )}
          {step === 3 && (
            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Profile'}</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostValidationSignup;