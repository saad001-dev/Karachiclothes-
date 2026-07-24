import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const CommentBox = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  const loadComments = async () => {
    if (!productId) return;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load error:", error);
        setError("Failed to load comments");
      } else {
        setComments(data || []);
        setError("");
      }
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load comments");
    }
  };

  useEffect(() => {
    if (productId) {
      loadComments();
    }
  }, [productId]);

  const submitComment = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !comment.trim()) {
      setError("Please enter your name and comment!");
      return;
    }

    setLoading(true);
    try {
      const newComment = {
        product_id: productId,
        name: name.trim(),
        comment: comment.trim(),
        rating: rating,
      };

      const { error } = await supabase.from("reviews").insert([newComment]);

      if (error) {
        console.error("Insert error:", error);
        setError("Database error: " + error.message);
        setLoading(false);
        return;
      }

      setName("");
      setComment("");
      setRating(5);
      await loadComments();
      window.dispatchEvent(new Event("ratingUpdate"));
    } catch (err) {
      console.error("Submit error:", err);
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleUpdate = () => {
      loadComments();
    };
    window.addEventListener("ratingUpdate", handleUpdate);
    return () => window.removeEventListener("ratingUpdate", handleUpdate);
  }, []);

  const StarButton = ({ value, filled, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`text-2xl transition-colors ${filled ? "text-yellow-400" : "text-gray-300"}`}
    >
      ★
    </button>
  );

  return (
    <div className="w-full mt-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={submitComment} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Your Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              value={star}
              filled={star <= rating}
              onClick={setRating}
            />
          ))}
        </div>

        {/* 🔥 FIXED: Input boxes + Button in one line with proper spacing */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="flex-1 min-w-[120px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="flex-[2] min-w-[180px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap min-w-[100px]"
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {loading && comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No reviews yet. Be the first to review! 😊
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{c.name}</span>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < c.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{c.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentBox;
