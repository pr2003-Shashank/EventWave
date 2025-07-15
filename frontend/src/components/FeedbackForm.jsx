import { useState, useContext, useEffect } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { ThreeDot } from "react-loading-indicators";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const FeedbackForm = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { role, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEventTitle(data.title);
      } catch (error) {
        console.error("Error fetching event title:", error);
        setEventTitle("Untitled Event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventTitle();
    } else {
      setLoading(false);
    }
  }, [eventId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || description.trim() === "") {
      toast.warn(`Please provide both rating and feedback.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          rating,
          comment: description,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to submit feedback";
        try {
          const text = await response.text();
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (err) {
          console.error("Error parsing error response:", err);
        }
        throw new Error(errorMessage);
      }

      toast.success(`Feedback submitted! Thank you.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      setRating(0);
      setDescription("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error(
        error.message || "Error submitting feedback. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
    }
  };

  if (role !== "USER") {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDot size={30} color="#712681" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div
        className="rounded-2xl p-6 w-full max-w-5xl shadow-2xl border border-gray-300 font-RobotoSlab"
        style={{
          background: "linear-gradient(135deg, #e9cbf0 0%, #ffffff 100%)",
        }}
      >
        <h2 className="text-2xl font-bold text-center text-[#712681] mb-6">
          We Value Your Feedback - " {eventTitle} "
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={starValue}
                    className="hidden"
                    onClick={() => setRating(starValue)}
                  />
                  <FaStar
                    className={`cursor-pointer transition text-3xl ${
                      starValue <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>

          {/* Description */}
          <div>
            <textarea
              className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a] focus:outline-none transition"
              rows="5"
              placeholder="Write your feedback here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#712681] hover:bg-[#5e1c6a] text-white py-3 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
