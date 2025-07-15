import React, { useState, useEffect, useContext, useRef } from "react";
import LocationMap from "../utils/LocationMap";
import { toast, Bounce } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [showMap, setShowMap] = useState(false);
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const originalDataRef = useRef(null);
   const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    bio: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = {
          full_name: response.data.fullName || "",
          username: response.data.username || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          city: response.data.city || "",
          state: response.data.state || "",
          country: response.data.country || "",
          zip_code: response.data.zipCode || "",
          latitude: response.data.latitude || "",
          longitude: response.data.longitude || "",
        };

        setFormData(data);
        originalDataRef.current = data; // Save for comparison
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
        navigate(-1);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Shallow comparison of changed fields
    const isUnchanged = Object.entries(formData).every(
      ([key, value]) => value === originalDataRef.current?.[key]
    );

    if (isUnchanged) {
      toast.info("No changes to save.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const payload = {
      bio: formData.bio,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zip_code,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/api/auth/profile/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const message =
        typeof response.data === "string"
          ? response.data
          : "Profile updated successfully";

      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });

      // Update original data reference
      originalDataRef.current = { ...formData };
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <section className="py-8  font-RobotoSlab">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div
          className={`relative flex flex-col min-w-0 w-full mb-6 shadow-lg border-0 ${
            role === "ORGANIZER" ? "bg-[#ffe7b9]" : "bg-[#e4cce9]"
          } shadow-purple-900/50 rounded-[15px]`}
        >
          <div
            className={`rounded-t-[15px] mb-0 px-6 py-6 ${
              role === "ORGANIZER" ? "bg-[#ffaf16]" : "bg-[#ba6dca]"
            }`}
          >
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                My Account
              </h6>
              <button
                className=" text-[#712681] font-bold uppercase  text-xs px-4 py-2 rounded-full bg-white hover:bg-gray-100 shadow hover:shadow-md transition duration-150 "
                type="submit"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit}>
              {/* User Information */}
              <h6 className="text-sm mt-3 mb-6 font-bold uppercase">
                User Information
              </h6>
              <div className="flex flex-wrap">
                {/* Full Name */}
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-xs font-bold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      readOnly
                      value={formData.full_name}
                      className="border-0 px-3 py-3 bg-gray-200 text-sm rounded shadow w-full cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-xs font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      readOnly
                      value={formData.username}
                      className="border-0 px-3 py-3 bg-gray-200 text-sm rounded shadow w-full cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      readOnly
                      value={formData.email}
                      className="border-0 px-3 py-3 bg-gray-200 text-sm rounded shadow w-full cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold uppercase">
                Location Information
              </h6>
              <div className="flex flex-wrap">
                {/* City */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    CITY
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* State */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    STATE
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* Country */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* ZIP Code */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    ZIP CODE
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* Latitude */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    LATITUDE
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* Longitude */}
                <div className="w-full lg:w-4/12 px-4 mb-4">
                  <label className="block uppercase text-xs font-bold mb-2">
                    LONGITUDE
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="w-full px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow focus:outline-none focus:ring transition-all duration-150"
                  />
                </div>

                {/* Select from Map */}
                <div className="w-full lg:w-4/12 px-4 mb-4 flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (showMap) {
                        setShowMap(false); // hide the map
                      } else {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords;
                              setFormData((prev) => ({
                                ...prev,
                                latitude: latitude.toFixed(6),
                                longitude: longitude.toFixed(6),
                              }));
                              setShowMap(true);
                            },
                            (error) => {
                              alert("Location access denied or unavailable.");
                              console.error(error);
                            }
                          );
                        } else {
                          alert(
                            "Geolocation is not supported by this browser."
                          );
                        }
                      }
                    }}
                    className="bg-[#712681] text-white text-sm font-bold px-4 py-2 rounded shadow hover:bg-[#6b4574] transition"
                  >
                    {showMap ? "Close Map" : "Select from Map"}
                  </button>
                </div>

                {/* Conditionally Render Map */}
                {showMap && (
                  <div className="w-full px-4 mb-6">
                    <LocationMap
                      coords={{
                        lat: parseFloat(formData.latitude) || 0,
                        lng: parseFloat(formData.longitude) || 0,
                      }}
                      setCoords={({ lat, lng }) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              {/* About */}
              <h6 className="text-blueGray-700 text-sm mt-3 mb-6 font-bold uppercase">
                About Me
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-xs font-bold mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Write something about yourself..."
                      className="border-0 px-3 py-3 bg-white placeholder-blueGray-300 text-sm rounded shadow w-full focus:outline-none focus:ring transition-all duration-150"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
