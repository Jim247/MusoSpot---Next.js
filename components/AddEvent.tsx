"use client"
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { Muso, Agent } from '../constants/users';
import { useAuth } from '../lib/firebase';
import { INSTRUMENTS } from '@constants/instruments';
import { postcodeToGeoPoint } from '@utils/PostcodeUtils';
import { EVENT_TYPES } from '../constants/event';
import { Timestamp } from 'firebase/firestore';
import PostcodeAutocomplete from '@utils/ValidatePostcode';
import type { EventPost } from '@constants/event';

interface AddEventFormValues {
  postcode: string;
  date: string;
  eventType: string;
  instrumentsNeeded: string[];
  budget: string;
  text: string;
}

export default function AddEvent() {
  const { user } = useAuth() as { user: Muso | Agent | null };

  const [isConfirming, setIsConfirming] = React.useState(false);
  const [eventDataToConfirm, setEventDataToConfirm] = React.useState<EventPost | null>(null);
  const [submitError, setSubmitError] = React.useState('');
  const [message, setMessage] = React.useState('');

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AddEventFormValues>({
    defaultValues: {
      postcode: '',
      date: '',
      eventType: '',
      instrumentsNeeded: [],
      budget: '',
      text: '',
    },
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg text-center">
        <h2 className="text-2xl font-bold text-black mb-4">Login Required</h2>
        <p className="text-gray-700 mb-4">You must log in to add events.</p>
        <a
          href="/login"
          className="inline-block btn-primary px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
        >
          Log In
        </a>
      </div>
    );
  }

  const onSubmit = async (data: AddEventFormValues) => {
    setSubmitError('');
    setMessage('');

    if (data.instrumentsNeeded.length === 0) {
      setError('instrumentsNeeded', { message: 'Please select at least one instrument' });
      return;
    }

    if (data.text.length < 50) {
      setError('text', {
        message: 'Please provide more information, so our musicians are well informed (at least 50 characters).',
      });
      return;
    }

    try {
      const geoPoint = await postcodeToGeoPoint(data.postcode);
      if (!geoPoint) {
        setError('postcode', { message: 'Unable to find location for the provided postcode' });
        return;
      }

      const eventData: EventPost = {
        postcode: data.postcode,
        geoPoint,
        date: new Timestamp(Math.floor(new Date(data.date).getTime() / 1000), 0),
        instrumentsNeeded: data.instrumentsNeeded,
        budget: Number(data.budget),
        extraInfo: data.text,
        eventType: data.eventType,
        agentId: user.id,
        event_id: '',
        status: 'pending',
      };

      setEventDataToConfirm(eventData);
      setIsConfirming(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error preparing event data');
    }
  };

  const handleConfirm = async () => {
    if (!eventDataToConfirm || !user) {
      setSubmitError('Missing event data or user information. Please go back and try again.');
      return;
    }
    setSubmitError('');
    try {
      await createEventWithNotifications(eventDataToConfirm, user.id);
      window.location.href = '/dashboard';
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error creating event');
    }
  };

  const handleBack = () => {
    setIsConfirming(false);
    setEventDataToConfirm(null);
    setSubmitError('');
  };

  if (isConfirming && eventDataToConfirm) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
        <div className="mb-2">
          <strong>Date:</strong> {eventDataToConfirm.date.toDate().toLocaleDateString()}
        </div>
        <div className="mb-2">
          <strong>Event Type:</strong> {eventDataToConfirm.eventType}
        </div>
        <div className="mb-2">
          <strong>Postcode:</strong> {eventDataToConfirm.postcode}
        </div>
        <div className="mb-2">
          <strong>Instruments Needed:</strong> {eventDataToConfirm.instrumentsNeeded.join(', ')}
        </div>
        <div className="mb-2">
          <strong>Price Per Musician (£):</strong> {eventDataToConfirm.budget}
        </div>
        <div className="mb-4">
          <strong>More Information:</strong> {eventDataToConfirm.extraInfo}
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={handleBack} className="btn btn-secondary">
            Back
          </button>
          <button type="button" onClick={handleConfirm} className="btn btn-primary">
            Confirm Event
          </button>
        </div>
        {submitError && <p className="mb-4 text-red-600">{submitError}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      {submitError && <p className="mb-4 text-red-600">{submitError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Postcode Field */}
        <div className="mb-4">
          <label className="block mb-1">Postcode:</label>
          <Controller
            name="postcode"
            control={control}
            rules={{ required: 'Please enter a valid UK postcode' }}
            render={({ field }) => (
              <PostcodeAutocomplete {...field} value={field.value} onChange={field.onChange} required />
            )}
          />
          {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>}
        </div>

        {/* Date Field */}
        <div className="mb-4">
          <label className="block mb-1">Date:</label>
          <input
            type="date"
            {...register('date', { required: 'Please select a date' })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border rounded px-3 py-2"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* Event Type Field */}
        <div className="mb-4">
          <label className="block mb-1">Event Type:</label>
          <select
            {...register('eventType', { required: 'Please select an event type' })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>
              What is the event?
            </option>
            {EVENT_TYPES.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
          {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>}
        </div>

        {/* Instruments Selection */}
        <div className="mb-4">
          <label className="block mb-1">Instruments Needed:</label>
          <Controller
            name="instrumentsNeeded"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value.map((instr: string, idx: number) => (
                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded inline-flex items-center">
                      {instr}
                      <button
                        type="button"
                        onClick={() => field.onChange(field.value.filter((i: string) => i !== instr))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !field.value.includes(e.target.value)) {
                      field.onChange([...field.value, e.target.value]);
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select instruments</option>
                  {INSTRUMENTS.filter((i) => !field.value.includes(i)).map((instrument) => (
                    <option key={instrument} value={instrument}>
                      {instrument}
                    </option>
                  ))}
                </select>
              </>
            )}
            rules={{ validate: (v) => v.length > 0 || 'Please select at least one instrument' }}
          />
          {errors.instrumentsNeeded && <p className="text-red-500 text-sm mt-1">{errors.instrumentsNeeded.message}</p>}
        </div>

        {/* Budget Field */}
        <div className="mb-4">
          <label className="block mb-1">Price Per Musician (£):</label>
          <input
            type="number"
            {...register('budget', {
              required: 'Please enter a valid budget',
              min: { value: 0, message: 'Budget must be at least 0' },
            })}
            className="w-full border rounded px-3 py-2"
            placeholder="Example: 200"
            min="0"
          />
          {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
        </div>

        {/* More Information Field */}
        <div className="mb-4">
          <label className="block mb-1">More Information:</label>
          <textarea
            {...register('text', {
              required: 'Please provide more information',
              minLength: { value: 10, message: 'At least 10 characters required' },
            })}
            placeholder="Enter more information about the event..."
            rows={5}
            maxLength={500}
            minLength={10}
            className="w-full border rounded px-3 py-2"
          />
          {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex">
          <button type="submit" className="btn btn-primary">
            Review Event Details
          </button>
        </div>
      </form>
    </div>
  );
}

