import React from "react";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  RiFileEditFill,
  RiDeleteBin6Line,
  RiFeedbackFill,
} from "react-icons/ri";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useContext } from "react";
import ParticipantModal from "../utils/ParticipantModal";
import { AuthContext } from "../context/AuthContext";
import EditEventModal from "../utils/EditEventModal";
import FeedbackForm from "./FeedbackModal";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const OrganizerActions = ({
  event,
  setEvent,
  handleDeleteClick,
  showModal,
  setShowModal,
  editModalOpen,
  setEditModalOpen,
  hasEventStarted,
}) => {
  // const hasEventPassed = false;
  const { token } = useContext(AuthContext);
  const [feedbackMOdalOpen, setFeedbackModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };
  const handleFeedback = () => {
    setFeedbackModalOpen(true);
  };
  return (
    <>
      <hr className="my-8 border border-blueGray-300" />

      <div className="flex flex-wrap gap-3 mb-6 justify-evenly">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-indigo-950 text-sm font-semibold rounded-full shadow bg-[#ec9b00] hover:bg-[#ffaf16] transition duration-300 hover:scale-95 hover:cursor-pointer flex items-center gap-1"
        >
          <FaPeopleGroup size={28} />
          View Participants
        </button>

        {/* If event is upcoming: show Edit/Delete, else Show Feedback */}
        {hasEventStarted ? (
          <button
            onClick={handleFeedback} // Replace with actual logic
            className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow bg-green-600 hover:bg-green-700 transition duration-300 hover:scale-95 hover:cursor-pointer flex items-center gap-1"
          >
            <RiFeedbackFill size={24} />
            Show User Feedback
          </button>
        ) : (
          <>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow bg-blue-600 hover:bg-blue-700 transition duration-300 hover:scale-95 hover:cursor-pointer flex items-center gap-1"
            >
              <RiFileEditFill size={24} />
              Edit Event
            </button>

            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 text-white text-sm font-semibold rounded-full shadow bg-red-600 hover:bg-red-700 transition duration-300 hover:scale-95 hover:cursor-pointer flex items-center gap-1"
            >
              <RiDeleteBin6Line size={24} />
              Delete Event
            </button>
          </>
        )}
      </div>

      {showModal && (
        <ParticipantModal
          eventId={event.id}
          token={token}
          onClose={() => setShowModal(false)}
        />
      )}
      {editModalOpen && (
        <EditEventModal
          event={event}
          token={token}
          onClose={() => setEditModalOpen(false)}
          onUpdate={() => {
            axios
              .get(`${BASE_URL}/api/events/${event.id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              })
              .then((res) => setEvent(res.data))
              .catch((err) => console.error("Failed to refresh event:", err));
          }}
        />
      )}

      <Dialog
        open={feedbackMOdalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          User Feedback
          <IconButton onClick={() => setFeedbackModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FeedbackForm eventId={event.id} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizerActions;
