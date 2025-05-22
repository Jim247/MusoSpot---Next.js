"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Review, Muso } from '@constants/users';
import { supabase } from '../supabaseClient.js';

interface ReviewSectionProps {
  profileid: string;
  currentUser: Muso | null;
  reviews: Review[]
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

// Helper to format timestamp (assumes ISO string, Date, or Timestamp)
type TimestampLike = string | number | Date | { toDate: () => Date };
function hasToDate(obj: unknown): obj is { toDate: () => Date } {
  return typeof obj === 'object' && obj !== null && typeof (obj as { toDate: () => Date }).toDate === 'function';
}
function formatReviewDate(timestamp: TimestampLike) {
  let date: Date;
  if (hasToDate(timestamp)) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp as string | number | Date);
  }
  return date.toLocaleDateString();
}

// Fetch reviews for a user from Supabase
async function fetchUserReviews(profileid: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', profileid)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Add a review for a user in Supabase
async function addUserReview(
  profileid: string,
  rating: number,
  comment: string,
  reviewer?: Muso | null
) {
  const { error } = await supabase.from('reviews').insert([
    {
      profile_id: profileid,
      rating,
      comment,
      reviewer_id: reviewer?.id || reviewer?.id || null,
      reviewer_name: reviewer?.first_name
        ? `${reviewer.first_name} ${reviewer.last_name || ''}`.trim()
        : null,
      timestamp: new Date().toISOString(),
    },
  ]);
  if (error) throw error;
}

// Helper to strip HTML tags
function stripHtmlTags(input: string) {
  return input.replace(/<[^>]*>?/gm, '');
}

const MIN_REVIEW_WORDS = 5;
const MAX_REVIEW_WORDS = 300;

export default function ReviewSection({ profileid, currentUser }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  useEffect(() => {
    async function loadReviews() {
      if (!profileid) return;
      setReviewLoading(true);
      setReviewError('');
      try {
        const fetchedReviews = await fetchUserReviews(profileid);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setReviewError('Error loading reviews');
      }
      setReviewLoading(false);
    }
    loadReviews();
  }, [profileid]);

  const onReviewSubmit = async (data: ReviewFormData) => {
    if (!profileid) {
      setReviewError('Profile not found');
      return;
    }
    const cleanComment = stripHtmlTags(data.comment || '').trim();
    const wordCount = cleanComment.split(/\s+/).filter(Boolean).length;
    if (cleanComment && wordCount < MIN_REVIEW_WORDS) {
      setReviewError(`Review must be at least ${MIN_REVIEW_WORDS} words if provided.`);
      return;
    }
    if (wordCount > MAX_REVIEW_WORDS) {
      setReviewError(`Review must be no more than ${MAX_REVIEW_WORDS} words.`);
      return;
    }
    setSubmitting(true);
    setReviewError('');
    try {
      await addUserReview(profileid, data.rating, cleanComment, currentUser);
      reset({ rating: 5, comment: '' });
      // Refresh reviews
      const updatedReviews = await fetchUserReviews(profileid);
      setReviews(updatedReviews);
    } catch (err: unknown) {
      let message = 'Failed to submit review';
      if (err instanceof Error) {
        message = err.message;
      }
      setReviewError(message);
    }
    setSubmitting(false);
  };

  const canLeaveReview =
    currentUser &&
    (currentUser.id || currentUser.id) !== profileid &&
    !reviews.some((r) => r.reviewer_id === (currentUser.id || currentUser.id));

  return (
    <div className="pt-6">
      <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
      {reviewLoading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <li key={review.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-700">Rating:</span>
                <span className="text-yellow-500 text-lg">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              {review.comment && <div className="mt-1 text-gray-800 italic">&ldquo;{review.comment}&rdquo;</div>}
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                {review.timestamp && <span>{formatReviewDate(review.timestamp)}</span>}
                {review.reviewer_name && (
                  <span>
                    {review.timestamp ? ' · ' : ''}
                    reviewed by <span className="font-semibold text-gray-700">{review.reviewer_name}</span>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {reviewError && <div className="text-red-500 mt-2">{reviewError}</div>}

      {/* Review Form: Only show if logged in, not reviewing self, and not already reviewed */}
      {canLeaveReview && (
        <form onSubmit={handleSubmit(onReviewSubmit)} className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Leave a Review</h3>
          <div className="mb-2">
            <label className="block">Rating:</label>
            <select
              {...register('rating', { valueAsNumber: true })}
              className="ml-2 border rounded px-2 py-1"
              defaultValue={5}
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <textarea
              {...register('comment')}
              placeholder="Write your review here (optional)"
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary px-4 py-2 rounded disabled:opacity-50" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
}