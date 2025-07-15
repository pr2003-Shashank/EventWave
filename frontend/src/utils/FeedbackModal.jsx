import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const FeedbackModal = ({ eventId }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/reviews/summary/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setFeedbackData(res.data))
      .catch((err) => console.error("Failed to fetch feedback:", err));
  }, [eventId, token]);

  if (!feedbackData) return <p>Loading feedback...</p>;

  const { averageRating, totalReviews, ratingBreakdown } = feedbackData;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" size={30} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" size={30} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" size={30} />);
    }
    return stars;
  };

  return (
    <div className="space-y-4 font-RobotoSlab">
      <div className="flex items-center gap-2">
        <strong>Average Rating:</strong>
        <div className="flex">{renderStars(averageRating)}</div>
        <span className="text-xl text-gray-700">
          ({averageRating.toFixed(1)})
        </span>
      </div>

      <p>
        <strong>Total Reviews:</strong> {totalReviews}
      </p>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xl">
              {rating} <FaStar className="text-yellow-500" size={30} />
            </div>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="h-3 bg-yellow-500 rounded"
                style={{
                  width: totalReviews
                    ? `${(ratingBreakdown[rating] / totalReviews) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
            <span>({ratingBreakdown[rating]})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackModal;
