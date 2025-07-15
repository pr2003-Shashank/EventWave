import React, { useEffect, useState } from "react";
import axios from "axios";

const ParticipantModal = ({ eventId, token, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/registrations/attendees/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId, token, BASE_URL]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/15 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-3xl shadow-lg relative max-h-[90vh] flex flex-col">
        <h2 className="text-sm sm:text-2xl font-bold mb-4 text-center text-indigo-900">
          Registered Participants
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : participants.length > 0 ? (
          <div className="overflow-x-auto overflow-y-auto max-h-[150px]">
            <table className="w-full border-collapse min-w-[600px] text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left ">
                  <th className="border px-3 py-2 bg-white">#</th>
                  <th className="border px-3 py-2 bg-white">Full Name</th>
                  <th className="border px-3 py-2 bg-white">Email</th>
                  <th className="border px-3 py-2 bg-white">Username</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{user.fullName}</td>
                    <td className="border px-3 py-2">{user.email}</td>
                    <td className="border px-3 py-2">{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No participants found.</p>
        )}

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold hover:cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ParticipantModal;
