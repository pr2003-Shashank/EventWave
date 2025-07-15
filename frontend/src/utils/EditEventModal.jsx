import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const CATEGORY_URL = `${BASE_URL}/api/categories`;
const EDIT_EVENT_URL = `${BASE_URL}/api/events/edit`;

const EditEventModal = ({ event, token, onClose, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    price: event.price,
    capacity: event.capacity,
    categoryId: "",
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    latitude: event.latitude,
    longitude: event.longitude,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_URL);
        setCategories(response.data);
        const selectedCategory = response.data.find(
          (cat) => cat.name === event.categoryName
        );
        if (selectedCategory) {
          setFormData((prev) => ({
            ...prev,
            categoryId: selectedCategory.id,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [event.categoryName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const today = new Date().toISOString().split("T")[0];
    if (formData.date < today) {
      toast.error("Date cannot be in the past.");
      return false;
    }
    if (formData.endTime <= formData.startTime) {
      toast.error("End time must be after start time.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.put(`${EDIT_EVENT_URL}/${event.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event updated successfully!", { autoClose: 2000 });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event", { autoClose: 2000 });
    }
  };

  const fetchCoordinates = async () => {
    if (!formData.location.trim()) {
      toast.warn("Enter a location", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const base = encodeURIComponent(formData.location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${base}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data?.length) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({
          ...prev,
          latitude: +lat,
          longitude: +lon,
        }));
        toast.success("Coordinates fetched successfully!", { autoClose: 3000 });
      } else {
        // Fallback: try simplified location
        const simplifiedLocation = formData.location
          .split(",")
          .slice(-3)
          .join(",")
          .trim();

        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          simplifiedLocation
        )}`;

        const fallbackRes = await fetch(fallbackUrl);
        const fallbackData = await fallbackRes.json();

        if (fallbackData?.length) {
          const { lat, lon } = fallbackData[0];
          setFormData((prev) => ({
            ...prev,
            latitude: +lat,
            longitude: +lon,
          }));
          toast.info("Using approximate city center coordinates", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
        } else {
          toast.error(
            "Couldn't find location — please try a different address",
            {
              position: "top-right",
              autoClose: 3000,
              theme: "colored",
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Geocoding failed", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md backdrop-saturate-150 p-4">
      <div className="max-h-screen overflow-y-auto ">
        <div
          className="rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-gray-300 font-RobotoSlab"
          style={{
            background: "linear-gradient(135deg, #ffe7b9 0%, #ffffff 100%)",
          }}
        >
          <h2 className="text-2xl font-bold text-[#5e1c6a] mb-6 text-center">
            Edit Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={fetchCoordinates}
                  className="mt-2 px-4 py-2 bg-[#ffaf16] text-white rounded hover:bg-[#e69d10] transition text-sm"
                >
                  Get Coordinates from Address
                </button>
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Capacity (Seats)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-[#5e1c6a] font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a]  focus:outline-none transition"
                  step="any"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#5e1c6a] font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-1 focus:ring-[#5e1c6a] focus:outline-none transition"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-400 text-white rounded-full shadow hover:scale-95 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#5e1c6a] text-white font-semibold rounded-full shadow hover:bg-[#704677] hover:scale-95 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
