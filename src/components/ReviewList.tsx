
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

type Review = {
  id: number;
  rating: number;
  review_text: string | null;
  is_anonymous: boolean;
  username: string | null;
  created_at: string;
};

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

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation();
  if (!reviews?.length)
    return <div className="text-gray-500 text-sm">{t("noReviewsYet") || "No reviews yet."}</div>;
  return (
    <ul className="space-y-4" aria-label="Product reviews">
      {reviews.slice(0, 5).map(r => (
        <li
          key={r.id}
          className="border rounded-lg p-3 bg-gray-50 dark:bg-lux-black/60 flex flex-col gap-1 relative"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center" aria-label={`Rating: ${r.rating} out of 5`}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={17}
                  className={i <= r.rating ? "text-yellow-400" : "text-gray-300"}
                  fill={i <= r.rating ? "#fbbf24" : "none"}
                  aria-hidden={i > r.rating}
                />
              ))}
            </span>
            <span className="ml-2 font-semibold text-green-800 dark:text-lux-gold text-base">
              {r.is_anonymous || !r.username ? (t("anonymous") || "Anonymous") : r.username}
            </span>
            <span className="ml-2 text-xs text-gray-400">{getTimeAgo(r.created_at)}</span>
          </div>
          {r.review_text && (
            <p className="text-gray-900 dark:text-gray-200 italic">{r.review_text}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
