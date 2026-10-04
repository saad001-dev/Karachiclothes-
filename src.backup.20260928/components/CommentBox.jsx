// src/components/CommentBox.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const CommentBox = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  // ===== Load reviews =====
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/reviews/${productId}`);
      setReviews(res.data.data || []);
      setAverage(res.data.average || 0);
    } catch (error) {
      console.error("❌ Error loading reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ===== Submit review =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/reviews", {
        productId: String(productId),
        name: name.trim(),
        rating: Number(rating),
        comment: comment.trim(),
      });

      toast.success("Review added successfully!");

      // Reset form
      setName("");
      setRating(5);
      setComment("");
      setHoveredStar(0);

      // Reload reviews
      fetchReviews();
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Format date =====
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
          <div className="text-3xl font-bold text-gray-800">
            {average.toFixed(1)}
          </div>
          <div>
            <div className="flex text-yellow-400 text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= Math.round(average) ? "" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Based on {reviews.length} review{reviews.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 rounded-lg p-4 space-y-3"
      >
        <h4 className="text-sm font-semibold text-gray-700">
          ✍️ Write a Review
        </h4>

        {/* Rating */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="text-2xl transition-transform hover:scale-110"
              >
                <span
                  className={
                    star <= (hoveredStar || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows="3"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2.5 text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {review.name}
                    </p>
                    <div className="flex text-yellow-400 text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating ? "" : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentBox;
