import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "./EventCard";
import { AuthContext } from "../context/AuthContext";
import { ThreeDot } from "react-loading-indicators";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const MY_EVENT_URL = `${BASE_URL}/api/events/my-events`;
const FAVORITE_ADD_URL = `${BASE_URL}/api/favorites/add`;
const FAVORITE_REMOVE_URL = `${BASE_URL}/api/favorites/remove`;

const Dashboard = () => {
  const {
    role: userType,
    isLoggedIn,
    loading,
    token,
  } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await axios.get(MY_EVENT_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !userType || !token) return;
    fetchEvents();
  }, [userType, loading, token]);

  const handleFavoriteToggle = async (eventId, isFavorite) => {
    if (!token) {
      toast.warn("Please login to favorite events.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${FAVORITE_REMOVE_URL}/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${FAVORITE_ADD_URL}/${eventId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchEvents();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite. Please try again.");
    }
  };

  const buttonColor =
    userType === "USER"
      ? "bg-[#9030a5] hover:bg-[#751d8a]"
      : "bg-[#ffaf16] hover:bg-[#e69d10]";

  const isSameOrAfterToday = (dateStr) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const upcomingEvents = events.filter((event) =>
    isSameOrAfterToday(event.date)
  );
  const completedEvents = events.filter(
    (event) => !isSameOrAfterToday(event.date)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDot size={30} color="#712681" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12 font-RobotoSlab">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#712681] drop-shadow">
          Your Events
        </h2>

        {userType !== "USER" && (
          <button
            onClick={() => navigate("/eventcreation")}
            className="bg-[#712681] text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-base sm:text-lg rounded-xl hover:bg-[#5e1c6a] transition"
          >
            Create New Event
          </button>
        )}
      </div>

      {eventsLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ThreeDot size={30} color="#712681" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {upcomingEvents.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold text-[#712681] mb-4">
                Upcoming Events
              </h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onFavoriteToggle={() =>
                      handleFavoriteToggle(event.id, event.favorite)
                    }
                    buttonColor={buttonColor}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-lg py-8">
              No upcoming events.
            </p>
          )}
          {completedEvents.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-[#712681] mb-4">
                Completed Events
              </h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {completedEvents.map((event) => {
                  const toggleFavorite = () =>
                    handleFavoriteToggle(event.id, event.favorite);

                  return (
                    <EventCard
                      key={event.id}
                      event={event}
                      onFavoriteToggle={toggleFavorite}
                      buttonColor={buttonColor}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
