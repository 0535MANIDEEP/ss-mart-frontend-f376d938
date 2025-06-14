
import React, { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

type Review = {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
};

function getReviewsKey(productId: string) {
  return `ssmart_reviews_${productId}`;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);

  // Load reviews from localStorage
  useEffect(() => {
    const data = localStorage.getItem(getReviewsKey(productId));
    setReviews(data ? JSON.parse(data) : []);
  }, [productId]);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);

    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      comment: comment.trim(),
      rating,
      date: new Date().toLocaleString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(getReviewsKey(productId), JSON.stringify(updated));
    setName("");
    setComment("");
    setRating(5);
    setSubmitting(false);
  };

  const handleDelete = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(getReviewsKey(productId), JSON.stringify(updated));
  };

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold mb-3">{t("reviews") || "Product Reviews"}</h3>
      <form onSubmit={handleReview} className="mb-6 space-y-3">
        <div className="flex gap-2 flex-col sm:flex-row">
          <Input
            placeholder={t("yourName") || "Your Name"}
            value={name}
            required
            maxLength={28}
            onChange={e => setName(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm">{t("rating") || "Rating"}: </span>
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={n <= rating ? "text-yellow-500" : "text-gray-400"}
                aria-label={t("rate") + " " + n}
                tabIndex={0}
              >
                <Star fill={n <= rating ? "#fcd34d" : "none"} size={22} />
              </button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder={t("writeReview") || "Write your review..."}
          value={comment}
          required
          maxLength={250}
          onChange={e => setComment(e.target.value)}
        />
        <Button
          type="submit"
          disabled={submitting || !name || !comment}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          {t("submitReview") || "Submit Review"}
        </Button>
      </form>
      {reviews.length === 0 && (
        <div className="text-gray-500 text-sm">{t("noReviewsYet") || "No reviews yet."}</div>
      )}
      <ul className="space-y-4">
        {reviews.map(r => (
          <li
            key={r.id}
            className="border rounded-lg p-3 bg-gray-50 dark:bg-lux-black/60 flex flex-col gap-1 relative group"
          >
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-green-800 dark:text-lux-gold">{r.name}</strong>
              <span className="flex items-center">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={18} className={i <= r.rating ? "text-yellow-400" : "text-gray-300"} fill={i <= r.rating ? "#fbbf24" : "none"} />
                ))}
              </span>
              <span className="ml-2 text-xs text-gray-400">{r.date}</span>
            </div>
            <p className="text-gray-900 dark:text-gray-200">{r.comment}</p>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              type="button"
              aria-label={t("deleteReview") || "Delete Review"}
              onClick={() => handleDelete(r.id)}
            >
              <Trash size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
