import { Timestamp } from 'firebase/firestore';

export function formatReviewDate(ts: Timestamp): string {
  let date: Date | null = null;
  if (!ts) return '';
  if (typeof ts.toDate === 'function') {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else if (typeof ts === 'number') {
    date = new Date(ts);
  }
  if (!date) return '';
  return date
    .toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ' at');
}