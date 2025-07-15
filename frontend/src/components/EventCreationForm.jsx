import { useEffect, useState, useContext } from "react";
import Stepper, { Step } from "../Reactbits/Stepper/Stepper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const CATEGORY_URL = `${BASE_URL}/api/categories`;
const CREATION_URL = `${BASE_URL}/api/events/create`;

const EventCreationForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    capacity: "",
    category: "",
    categoryId: "",
    date: "",
    startTime: "",
    endTime: "",
    latitude: "",
    longitude: "",
    imageFile: null,
    imageUrl: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { role, token } = useContext(AuthContext);

  const today = dayjs();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_URL);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.imageFile) {
      const objectUrl = URL.createObjectURL(form.imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (form.imageUrl) {
      setPreviewUrl(form.imageUrl);
    } else {
      setPreviewUrl("");
    }
  }, [form.imageFile, form.imageUrl]);

  const isEndTimeValid = (start, end) => {
    const startTime = dayjs(start, "HH:mm");
    const endTime = dayjs(end, "HH:mm");
    return !(start && end && endTime.isBefore(startTime));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", form.title);
    formDataToSend.append("description", form.description);
    formDataToSend.append("location", form.location);
    formDataToSend.append("price", form.price);
    formDataToSend.append("capacity", form.capacity);
    formDataToSend.append("categoryId", form.categoryId);
    formDataToSend.append("date", form.date);
    formDataToSend.append("startTime", form.startTime);
    formDataToSend.append("endTime", form.endTime);
    formDataToSend.append("latitude", form.latitude);
    formDataToSend.append("longitude", form.longitude);

    if (form.imageFile) {
      formDataToSend.append("image", form.imageFile);
    } else if (form.imageUrl) {
      try {
        const response = await fetch(form.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        formDataToSend.append("image", file);
      } catch (err) {
        console.error("Failed to fetch image from URL", err);
        toast.error(
          "Invalid Image URL. Please go back to 'Image Details' (Step 3) and change it.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        return;
      }
    }
    // console.log([...formDataToSend.entries()]);
    try {
      const response = await fetch(CREATION_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("🎉 Event created successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        // console.log(result);
        navigate("/dashboard");
      } else {
        console.error("Server error:", result);
        toast.error("Failed to create event: " + result.message, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("An error occurred while creating the event.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      const selected = categories.find((cat) => cat.name === value);
      setForm((prev) => ({
        ...prev,
        category: value,
        categoryId: selected?.id || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      if (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.category ||
        !form.date ||
        !form.startTime ||
        !form.endTime
      ) {
        return false;
      }
      return isEndTimeValid(form.startTime, form.endTime);
    }

    if (currentStep === 2) {
      return (
        form.location.trim() &&
        form.latitude !== null &&
        form.longitude !== null &&
        form.capacity &&
        form.price
      );
    }

    if (currentStep === 3) {
      return !!(form.imageFile || form.imageUrl);
    }

    return true;
  };

  if (role === "USER") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-center font-bold mb-6 mt-2 text-[#712681] text-2xl sm:text-3xl md:text-4xl">
        Create Event
      </h1>
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          setCurrentStep(step);
        }}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Previous"
        nextButtonText="Next"
        canProceed={isStepValid()}
      >
        {/* Event Details */}
        <Step>
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded p-3 mb-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
            required
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded p-3 mb-2 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
            rows={3}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded p-3 mb-3 bg-white text-gray-500 border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="mb-3">
              <DatePicker
                defaultValue={today}
                disablePast
                name="date"
                value={form.date ? dayjs(form.date) : null}
                onChange={(newValue) => {
                  setForm((prev) => ({
                    ...prev,
                    date: newValue ? newValue.format("YYYY-MM-DD") : "",
                  }));
                }}
                required
                className="w-full rounded bg-white"
              />
            </div>
            <div className="mb-3">
              <MobileTimePicker
                name="startTime"
                label="Start Time"
                value={form.startTime ? dayjs(form.startTime, "HH:mm") : null}
                onChange={(newValue) => {
                  const newStartTime = newValue ? newValue.format("HH:mm") : "";
                  setForm((prev) => ({
                    ...prev,
                    startTime: newStartTime,
                  }));
                  if (
                    form.endTime &&
                    !isEndTimeValid(newStartTime, form.endTime)
                  ) {
                    toast.warn("End time must be after start time", {
                      position: "top-right",
                      autoClose: 3000,
                      theme: "colored",
                    });
                  }
                }}
                className="w-full rounded bg-white"
              />
            </div>
            <div className="mb-3">
              <MobileTimePicker
                name="endTime"
                label="End Time"
                value={form.endTime ? dayjs(form.endTime, "HH:mm") : null}
                onChange={(newValue) => {
                  const newEndTime = newValue ? newValue.format("HH:mm") : "";
                  setForm((prev) => ({
                    ...prev,
                    endTime: newEndTime,
                  }));
                  if (
                    form.startTime &&
                    !isEndTimeValid(form.startTime, newEndTime)
                  ) {
                    toast.warn("End time must be after start time", {
                      position: "top-right",
                      autoClose: 3000,
                      theme: "colored",
                    });
                    setForm((prev) => ({
                      ...prev,
                      endTime: "",
                    }));
                  }
                }}
                className="w-full rounded bg-white text-gray-500"
              />
            </div>
          </LocalizationProvider>
        </Step>

        {/* Venue details */}
        <Step>
          <h2 className="text-2xl font-semibold mb-4">Venue Details</h2>

          <div className="mb-3">
            <input
              type="text"
              name="location"
              placeholder="Location: [Street or Area], [City], [State], [Country]"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Example:{" "}
              <span className="italic">
                MG Road, Bengaluru, Karnataka, India
              </span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center justify-center text-center mb-2">
            <button
              type="button"
              onClick={async () => {
                if (!form.location.trim()) {
                  toast.warn("Enter a location", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                  });
                  return;
                }
                const base = encodeURIComponent(form.location);
                const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${base}`;

                try {
                  const res = await fetch(url);
                  const data = await res.json();

                  if (data?.length) {
                    const { lat, lon } = data[0];
                    setForm((prev) => ({
                      ...prev,
                      latitude: +lat,
                      longitude: +lon,
                    }));
                  } else {
                    // fallback: try extracting city/state/country from input
                    const simplifiedLocation = form.location
                      .split(",")
                      .slice(-3) // take last 3 parts like city, state, country
                      .join(",")
                      .trim();

                    const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
                      simplifiedLocation
                    )}`;

                    const fallbackRes = await fetch(fallbackUrl);
                    const fallbackData = await fallbackRes.json();

                    if (fallbackData?.length) {
                      const { lat, lon } = fallbackData[0];
                      setForm((prev) => ({
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
              }}
              className="mb-3 px-4 py-2 bg-[#ffaf16] text-white rounded hover:bg-[#e69d10] mr-3"
            >
              Get Coordinates from Address
            </button>

            <span className="text-gray-400 font-semibold text-sm text-center my-2 md:my-0">
              OR
            </span>

            {/* Button to use current device location */}
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setForm((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      }));
                    },
                    (error) => {
                      toast.error(
                        "📍 Unable to fetch location. Please allow location access.",
                        {
                          position: "top-right",
                          autoClose: 3000,
                          theme: "colored",
                        }
                      );

                      console.error(error);
                    }
                  );
                } else {
                  toast.error(
                    "🌐 Geolocation is not supported by this browser.",
                    {
                      position: "top-right",
                      autoClose: 3000,
                      theme: "colored",
                    }
                  );
                }
              }}
              className="mb-3 px-4 py-2 bg-[#9030a5] text-white rounded hover:bg-[#751d8a]"
            >
              Use My Current Location
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={form.latitude ?? ""}
              onChange={handleChange}
              className="w-full rounded p-3 mb-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
              required
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={form.longitude ?? ""}
              onChange={handleChange}
              className="w-full rounded p-3 mb-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
              required
            />
          </div>

          <input
            type="number"
            name="capacity"
            placeholder="Capacity (e.g., 100 attendees)"
            value={form.capacity}
            onChange={handleChange}
            className="w-full rounded p-3 mb-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (e.g., 499)"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded p-3 mb-3 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
            required
          />
        </Step>

        {/* Image Upload */}
        <Step>
          <h2 className="text-2xl font-semibold mb-4">Image Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload from your device
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    imageFile: e.target.files[0],
                    imageUrl: "",
                  }))
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#ffaf16] file:text-white hover:file:bg-[#ff8d58]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or paste an image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                    imageFile: null,
                  }))
                }
                className="w-full rounded p-3 mb-2 bg-white border border-gray-300 hover:border-black focus:border-blue-700 focus:border-2 focus:outline-none"
              />
            </div>
          </div>
        </Step>

        {/* Preview and Publish */}
        <Step>
          <h2 className="text-2xl font-semibold mb-4">Preview & Publish</h2>
          <div className="w-full rounded-2xl bg-white border border-[#ffaf16]/50 p-6 shadow-lg space-y-6">
            <div className="w-full flex justify-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Event"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-64 object-contain"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Title:</span> {form.title}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Description:</span>{" "}
                  {form.description}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Category:</span>{" "}
                  {form.category}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Date:</span> {form.date}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Start Time:</span>{" "}
                  {form.startTime}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">End Time:</span>{" "}
                  {form.endTime}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Location:</span>{" "}
                  {form.location}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Coordinates:</span>{" "}
                  {form.latitude}, {form.longitude}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Capacity:</span>{" "}
                  {form.capacity}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Price:</span> ₹{form.price}
                </p>
              </div>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm italic text-gray-500">
                Please confirm all details before publishing.
              </p>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export default EventCreationForm;
