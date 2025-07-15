import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import GoogleMapBox from "../utils/GoogleMapBox";
import OrganizerActions from "../utils/OrganizerActions";

//icons
import { FaCalendarDay, FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosClock } from "react-icons/io";
import { FaMapLocationDot, FaUserGroup, FaPeopleGroup } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { PiChairFill } from "react-icons/pi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

//MUI imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

//loader
import { ThreeDot } from "react-loading-indicators";

const EventDetails = () => {
  const { id } = useParams();
  const { token, role, customerUserName } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [isFavorite, setIsFavorite] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [hasEventStarted, setHasEventStarted] = useState(false);
  const [hasEventPassed, setHasEventPassed] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${BASE_URL}/api/events/${id}`, {
          headers,
        });
        setEvent(response.data);
        setIsFavorite(response.data.favorite);
        setAvailableSeats(response.data.availableSeats);

        if (response.data.registered === true) {
          setRegistered(true);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token, BASE_URL]);

  useEffect(() => {
    if (event?.date && event?.startTime && event?.endTime) {
      const eventDateTime = new Date(`${event.date}T${event.startTime}`);
      const now = new Date();
      setHasEventStarted(eventDateTime < now);

      const eventEndDateTime = new Date(`${event.date}T${event.endTime}`);
      setHasEventPassed(eventEndDateTime < now);
    }
  }, [event]);

  const handleRegisterClick = async () => {
    if (!token) {
      toast.warning("Please login to register for this event", {
        autoClose: 2000,
      });
      return;
    }
    try {
      // Optimistically update UI
      setRegistered(true);
      setAvailableSeats((prev) => prev - 1); // Optimistic decrease

      await axios.post(
        `${BASE_URL}/api/registrations/register`,
        { eventId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("You have successfully registered for this event!", {
        autoClose: 3000,
        containerId: "center-toast",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.", {
        autoClose: 2000,
      });

      // Revert optimistic update
      setRegistered(false);
      setAvailableSeats((prev) => prev + 1); // Revert
    }
  };

  const handleUnregisterClick = async () => {
    if (!token) {
      toast.warning("Please login to unregister", { autoClose: 2000 });
      return;
    }

    try {
      // Optimistically update UI
      setRegistered(false);
      setAvailableSeats((prev) => prev + 1); // Optimistic increase

      await axios.delete(
        `${BASE_URL}/api/registrations/unregister?eventId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.info("You have unregistered from the event.", {
        autoClose: 3000,
        containerId: "center-toast",
      });
    } catch (error) {
      console.error("Unregistration failed:", error);
      toast.error("Failed to unregister. Please try again.", {
        autoClose: 2000,
      });

      // Revert optimistic update
      setRegistered(true);
      setAvailableSeats((prev) => prev - 1); // Revert
    }
  };

  const handleFavoriteClick = async () => {
    //add api here
    if (!token) {
      toast.warning("Please login to favorite this event", { autoClose: 2000 });
      return;
    }

    try {
      const newFavorite = !isFavorite;
      setIsFavorite(newFavorite); // Optimistically update UI

      if (newFavorite) {
        await axios.post(`${BASE_URL}/api/favorites/add/${event.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Event added to favorites!", { autoClose: 2000 });
      } else {
        await axios.delete(`${BASE_URL}/api/favorites/remove/${event.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info("Event removed from favorites", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      toast.error("Something went wrong. Please try again.", {
        autoClose: 2000,
      });

      // Revert optimistic update
      setIsFavorite((prev) => !prev);
    }
  };

  if (!event)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-lg font-medium">
          <ThreeDot size={30} color="#712681" />
        </div>
      </div>
    );
  const handleDeleteClick = () => {
    setDialogConfig({
      title: "Confirm Deletion",
      message:
        "Are you sure you want to delete this event? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await axios.delete(
            `${BASE_URL}/api/events/delete/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success(response.data.message, { autoClose: 2000 });
          navigate("/events");
        } catch (error) {
          console.error(error.message);
          toast.error("Failed to delete event. Please try again.", {
            autoClose: 2000,
          });
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const formatTime12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(+hour);
    date.setMinutes(+minute);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <ToastContainer
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="colored"
        bodyClassName="text-lg"
        position="top-right"
        transition={Bounce}
      />
      <ToastContainer
        hideProgressBar={true}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="colored"
        toastClassName="!bg-[#ffc453] !text-black text-center !p-6 !rounded-xl !shadow-lg !text-2xl !font-semibold !shadow-md"
        bodyClassName=""
        position="top-center"
        transition={Zoom}
        style={{
          top: "50%",
        }}
        containerId="center-toast"
      />
      <div className="max-w-4xl mx-4 md:mx-auto my-10 p-4 sm:p-6 bg-[#e9cbf0] shadow-md rounded-lg font-RobotoSlab">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5e1c6a] mb-6 text-center">
          Event Details
        </h2>

        {/* Event Image */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-72 sm:h-80 rounded-lg mb-6 object-cover"
        />

        {/* Title + Register Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 break-words">
            {event.title}
          </h1>

          <div className="flex flex-col items-start sm:items-end gap-2">
            {availableSeats !== null &&
              !hasEventStarted &&
              (!token ||role === "USER" ||
                (role === "ORGANIZER" &&
                  customerUserName === event.organizer?.username)) && (
                <p className="text-sm text-red-600 font-medium">
                  {availableSeats} seats available out of {event.capacity}
                </p>
              )}

            {/* Register button for USER and unauthenticated */}
            {(!token || role === "USER") &&
              (hasEventPassed ? (
                // Case 1: Event is finished
                <p className="text-white text-lg font-semibold bg-red-600 px-4 py-2 rounded-full">
                  Event Completed
                </p>
              ) : hasEventStarted ? (
                // Case 2: Event is ongoing
                <button
                  disabled
                  className="w-full sm:w-auto px-4 py-2 text-white text-lg font-semibold rounded-full shadow bg-gray-400 cursor-not-allowed"
                >
                  Registration Closed
                </button>
              ) : (
                // Case 3: Event has not started
                <button
                  onClick={
                    registered
                      ? () => {
                          setDialogConfig({
                            title: "Confirm Unregistration",
                            message:
                              "Are you sure you want to unregister from this event?",
                            onConfirm: handleUnregisterClick,
                          });
                          setConfirmDialogOpen(true);
                        }
                      : availableSeats === 0
                      ? () => {}
                      : handleRegisterClick
                  }
                  disabled={availableSeats === 0 && !registered}
                  className={`w-full sm:w-auto px-4 py-2 text-white text-lg font-semibold rounded-full shadow transition duration-300 hover:scale-95 ${
                    registered
                      ? "bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                      : availableSeats === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#5e1c6a] hover:bg-[#704677] hover:cursor-pointer"
                  }`}
                >
                  {registered
                    ? "Unregister"
                    : availableSeats === 0
                    ? "Registration Closed"
                    : "Register"}
                </button>
              ))}
          </div>
        </div>

        {/* Description and Favorite */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <p className="text-lg sm:text-2xl text-gray-800 break-words">
            {event.description}
          </p>

          {(!token || role === "USER") && (
            <button
              className="text-red-500 text-4xl focus:outline-none cursor-pointer"
              onClick={handleFavoriteClick}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>

        {/* Organizer-only section */}
        {token &&
          role === "ORGANIZER" &&
          customerUserName === event.organizer?.username && (
            <OrganizerActions
              event={event}
              setEvent={setEvent}
              token={token}
              handleDeleteClick={handleDeleteClick}
              showModal={showModal}
              setShowModal={setShowModal}
              editModalOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
              hasEventStarted={hasEventStarted}
            />
          )}

        <hr className="my-8 border border-blueGray-300" />

        {/* Details + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Event Details */}
          <div className="space-y-4 text-gray-700 text-base sm:text-lg">
            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <FaCalendarDay size={20} /> Date:
              </span>
              {event.date.split("-").reverse().join("-")}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <IoIosClock size={20} /> Time:
              </span>
              {`${formatTime12Hour(event.startTime)} - ${formatTime12Hour(
                event.endTime
              )}`}
            </p>

            <p className="flex items-start gap-2">
              <span className="font-semibold flex items-center gap-1">
                <FaMapLocationDot size={20} /> Location:
              </span>
              {event.location}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <BiSolidCategoryAlt size={20} /> Category:
              </span>
              {event.categoryName}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <PiChairFill size={20} /> Capacity:
              </span>
              {event.capacity}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <RiMoneyRupeeCircleFill size={20} /> Price:
              </span>
              ₹{event.price}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1">
                <FaUserGroup size={20} /> Organizer:
              </span>
              {event.organizer?.fullName}
            </p>
          </div>

          {/* Map */}
          {event.latitude && event.longitude && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3">
                Event Location
              </h2>
              <GoogleMapBox lat={event.latitude} lng={event.longitude} />
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>{dialogConfig.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogConfig.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmDialogOpen(false);
              dialogConfig.onConfirm();
            }}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventDetails;
