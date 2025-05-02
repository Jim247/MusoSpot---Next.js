import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Review, User } from '~/constants/user';
import { addUserReview, fetchUserReviews } from '~/lib/firebase';
import { formatReviewDate } from '~/utils/formatReviewDate';

interface ReviewSectionProps {
  profileUid: string;
  currentUser: User | null;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export default function ReviewSection({ profileUid, currentUser }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false); // Keep submitting state for button feedback

  const { register, handleSubmit, reset } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  useEffect(() => {
    async function loadReviews() {
      if (!profileUid) return;
      setReviewLoading(true);
      setReviewError('');
      try {
        const fetchedReviews = await fetchUserReviews(profileUid);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setReviewError('Error loading reviews');
      }
      setReviewLoading(false);
    }
    loadReviews();
  }, [profileUid]);

  const onReviewSubmit = async (data: ReviewFormData) => {
    if (!profileUid) {
      setReviewError('Profile not found');
      return;
    }
    setSubmitting(true);
    setReviewError('');
    try {
      await addUserReview(profileUid, data.rating, data.comment);
      reset({ rating: 5, comment: '' }); // Reset form using react-hook-form's reset
      // Refresh reviews
      const updatedReviews = await fetchUserReviews(profileUid);
      setReviews(updatedReviews);
    } catch (err: unknown) {
      // Safely extract error message
      let message = 'Failed to submit review';
      if (err instanceof Error) {
        message = err.message;
      }
      setReviewError(message);
    }
    setSubmitting(false);
  };

  const canLeaveReview =
    currentUser && currentUser.uid !== profileUid && !reviews.some((r) => r.reviewerId === currentUser?.uid);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">User Reviews</h2>
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
              {review.comment && <div className="mt-1 text-gray-800 italic">"{review.comment}"</div>}
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                {/* Add check for timestamp before formatting */}
                {review.timestamp && <span>{formatReviewDate(review.timestamp)}</span>}
                {review.reviewerName && (
                  <span>
                    {review.timestamp ? ' · ' : ''} {/* Add separator only if date exists */}
                    reviewed by <span className="font-semibold text-gray-700">{review.reviewerName}</span>
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
              defaultValue={5} // Keep default value for initial render
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
