
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

type Review = {
  id: number;
  rating: number;
  review_text: string | null;
  is_anonymous: boolean;
  username: string | null;
  created_at: string;
};
type ReviewBreakdown = { [key: number]: number };

// -- Local review persistence helpers
function getLocalReviews(productId: string): Review[] {
  try {
    const r = localStorage.getItem(`review_${productId}`);
    return r ? JSON.parse(r) : [];
  } catch {
    return [];
  }
}
function setLocalReviews(productId: string, reviews: Review[]) {
  localStorage.setItem(`review_${productId}`, JSON.stringify(reviews.slice(0, 100)));
}

function getTimeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `${diffMon} month${diffMon > 1 ? "s" : ""} ago`;
  const diffYr = Math.floor(diffMon / 12);
  return `${diffYr} year${diffYr > 1 ? "s" : ""} ago`;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReviews(getLocalReviews(productId));
      setLoading(false);
    }, 250);
  }, [productId]);

  const averageRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length)
    : 0;
  const reviewCount = reviews.length;

  // Rating breakdown
  const breakdown: ReviewBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1; });
  const maxBarWidth = 85;

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || submitting) return;
    if (!isAnonymous && !username.trim()) {
      toast({
        title: t("nameRequired") || "Name required",
        description: t("namePrompt") || "Please provide your name or submit anonymously.",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    // add review to localStorage instead of API
    const newReview: Review = {
      id: Date.now(),
      rating,
      review_text: reviewText.trim(),
      is_anonymous: isAnonymous,
      username: isAnonymous ? null : username.trim() || null,
      created_at: new Date().toISOString()
    };
    const nextReviews = [newReview, ...getLocalReviews(productId)];
    setLocalReviews(productId, nextReviews);
    setReviews(nextReviews);
    toast({
      title: t("reviewSubmitSuccess") || "Review submitted!",
      description: t("thankYouForReview") || "Thank you for your feedback.",
      variant: "default"
    });
    setRating(5);
    setReviewText("");
    setIsAnonymous(true);
    setUsername("");
    setSubmitting(false);
  }

  return (
    <section className="mt-10">
      {/* Average & count */}
      <div className="flex items-center gap-5 mb-1 flex-wrap">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="flex gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                  fill={i < Math.round(averageRating) ? "#fbbf24" : "none"}
                />
              ))}
          </span>
          <span className="ml-2">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-base text-gray-600">
          ({reviewCount} {reviewCount === 1 ? t("reviewSingle") || "review" : t("reviewPlural") || "reviews"})
        </span>
      </div>
      {/* Rating breakdown */}
      <div className="mb-3 space-y-1 max-w-xs">
        {[5,4,3,2,1].map(star => (
          <div className="flex items-center gap-1" key={star}>
            <span className="w-5 shrink-0 font-medium">{star} </span>
            <Star size={15} className={star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
            <div className="flex-1 mx-2">
              <div
                className="h-2 rounded bg-gradient-to-r from-yellow-300 to-yellow-500"
                style={{
                  width:
                    reviewCount > 0
                      ? `${(breakdown[star] / Math.max(...Object.values(breakdown), 1)) * maxBarWidth + 8}px`
                      : "12px",
                  opacity: breakdown[star] ? 1 : 0.25,
                }}
              ></div>
            </div>
            <span className="text-gray-600 min-w-[10px]">{breakdown[star] || 0}</span>
          </div>
        ))}
      </div>
      {/* Review form */}
      <form onSubmit={handleReviewSubmit} className="mb-7 space-y-3" aria-label="Submit product review">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          {!isAnonymous && (
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={t("yourName") || "Your Name"}
              maxLength={28}
              className="w-full sm:w-1/2"
              required
              disabled={submitting}
              aria-label={t("yourName") || "Your Name"}
            />
          )}
          <div className="flex items-center gap-1" aria-label={t("rating") || "Rating"}>
            <span className="text-sm">{t("rating") || "Rating"}:</span>
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`rounded-lg p-0.5 ${n <= rating ? "text-yellow-500" : "text-gray-400"} focus-visible:ring-2 focus-visible:ring-lux-gold`}
                aria-label={(t("rate") || "Rate") + " " + n}
                tabIndex={0}
                disabled={submitting}
                style={{ minWidth: 32, minHeight: 32 }}
              >
                <Star fill={n <= rating ? "#fcd34d" : "none"} size={22} />
              </button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder={t("writeReview") || "Write your review..."}
          value={reviewText}
          maxLength={400}
          onChange={e => setReviewText(e.target.value)}
          disabled={submitting}
          aria-label={t("writeReview") || "Write your review"}
          className="rounded-lg bg-gray-50 dark:bg-lux-black/60 focus-visible:ring-2 focus-visible:ring-green-400"
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
            disabled={submitting}
            className="accent-green-600 mr-1 min-w-[20px] min-h-[20px]"
            aria-label={t("submitAnonymously") || "Submit anonymously"}
          />
          {t("submitAnonymously") || "Submit anonymously"}
        </label>
        <Button
          type="submit"
          disabled={submitting || !rating || (!isAnonymous && !username.trim())}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 min-w-[120px] text-base"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              {t("submitting") || "Submitting..."}
            </span>
          ) : (
            t("submitReview") || "Submit Review"
          )}
        </Button>
      </form>
      {/* Review list */}
      <div>
        {loading ? (
          <div className="text-gray-400 text-sm">{t("loadingReviews") || "Loading reviews..."}</div>
        ) : (
          <>
            {reviews.length === 0 && (
              <div className="text-gray-500 text-sm">{t("noReviewsYet") || "No reviews yet."}</div>
            )}
            <ul className="space-y-4">
              {reviews.slice(0, 5).map(r => (
                <li
                  key={r.id}
                  className="border rounded-lg p-3 bg-gray-50 dark:bg-lux-black/60 flex flex-col gap-1 relative"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* Stars */}
                    <span className="flex items-center">
                      {[1,2,3,4,5].map(i => (
                        <Star
                          key={i}
                          size={17}
                          className={i <= r.rating ? "text-yellow-400" : "text-gray-300"}
                          fill={i <= r.rating ? "#fbbf24" : "none"}
                        />
                      ))}
                    </span>
                    {/* Name or anon */}
                    <span className="ml-2 font-semibold text-green-800 dark:text-lux-gold text-base">
                      {r.is_anonymous || !r.username ? (t("anonymous") || "Anonymous") : r.username}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">{getTimeAgo(r.created_at)}</span>
                  </div>
                  {/* Comment */}
                  {r.review_text && (
                    <p className="text-gray-900 dark:text-gray-200 italic">{r.review_text}</p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
