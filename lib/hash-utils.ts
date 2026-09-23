/**
 * Deterministic hash-based rating and review count generator.
 * Eliminates Math.random() usage to guarantee 0 Next.js SSR hydration mismatches.
 */
export function getProductRating(idOrSlug: string): { rating: number; reviewCount: number } {
  let hash = 0;
  for (let i = 0; i < idOrSlug.length; i++) {
    hash = (hash << 5) - hash + idOrSlug.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  // Rating between 4.4 and 5.0 in 0.1 steps
  const ratingSteps = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 4.8, 4.9, 4.7, 5.0];
  const rating = ratingSteps[absHash % ratingSteps.length];
  // Review count between 14 and 160
  const reviewCount = 14 + (absHash % 147);
  return { rating, reviewCount };
}

/**
 * Format currency with PKR symbol
 */
export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
