import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EventCard from "./EventCard";
import { Filter, Search } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { ThreeDot } from "react-loading-indicators";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const EVENTS_URL = `${BASE_URL}/api/events`;
const CATEGORY_URL = `${BASE_URL}/api/categories`;
const FILTER_URL = `${BASE_URL}/api/events/filter`;
const FAVORITE_ADD_URL = `${BASE_URL}/api/favorites/add`;
const FAVORITE_REMOVE_URL = `${BASE_URL}/api/favorites/remove`;

const EventList = () => {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const { token, role } = useContext(AuthContext);

  const hasAppliedUrlCategory = useRef(false);
  const location = useLocation();
  const isFilterActive =
    searchQuery ||
    selectedLocation ||
    selectedCategory ||
    startDate ||
    endDate ||
    onlyFavorites;

  // Fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORY_URL);
        const categoriesData = response.data;

        const categoryNameToIdMap = {};
        categoriesData.forEach((category) => {
          categoryNameToIdMap[category.name] = category.id;
        });

        setCategories(categoriesData.map((category) => category.name));
        setCategoryMap(categoryNameToIdMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Category setting via URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    if (
      categoryFromUrl &&
      categoryMap[categoryFromUrl] &&
      !hasAppliedUrlCategory.current
    ) {
      setSelectedCategory(categoryFromUrl);
      toast.info(`Category "${categoryFromUrl}" filter applied from URL.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      fetchFilteredEvents({
        keyword: searchQuery,
        location: selectedLocation,
        categoryId: categoryMap[categoryFromUrl],
        startDate,
        endDate,
        onlyFavorites,
      });
      hasAppliedUrlCategory.current = true;
    }
  }, [location.search, categoryMap]);

  // Fetching Location
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await axios.get(EVENTS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const locations = [
          ...new Set(data.map((event) => event.location.trim().toLowerCase())),
        ]
          .sort((a, b) => a.localeCompare(b))
          .map((loc) => loc.replace(/\b\w/g, (char) => char.toUpperCase()));
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetaData();
  }, [token]);

  // Fetch all events on initial load (if no filters applied)
  useEffect(() => {
    if (!hasAppliedUrlCategory.current) {
      fetchFilteredEvents({
        keyword: "",
        location: "",
        categoryId: null,
        startDate: "",
        endDate: "",
        onlyFavorites: false,
      });
    }
  }, [categoryMap]);

  const fetchFilteredEvents = async ({
    keyword,
    location,
    categoryId,
    startDate,
    endDate,
    onlyFavorites,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const requestBody = {};

      if (keyword) requestBody.keyword = keyword;
      if (location) requestBody.location = location;
      if (categoryId) requestBody.categoryId = categoryId;

      let sortedStart = startDate;
      let sortedEnd = endDate;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        toast.info("Start date was after end date. Auto-corrected.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        sortedStart = endDate;
        sortedEnd = startDate;
      }

      if (sortedStart) requestBody.startDate = sortedStart;
      if (sortedEnd) requestBody.endDate = sortedEnd;

      const response = await axios.post(FILTER_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtered = response.data;
      if (onlyFavorites) {
        filtered = filtered.filter((event) => event.favorite);
      }
      setFilteredEvents(filtered);
    } catch (error) {
      console.error("Error filtering events:", error);
      setError("Failed to load filtered events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Search + Filter
  const handleApplyFilters = () => {
    fetchFilteredEvents({
      keyword: searchQuery,
      location: selectedLocation,
      categoryId: categoryMap[selectedCategory],
      startDate,
      endDate,
      onlyFavorites,
    });
    toast.success("Filters applied.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  const handleSearch = () => {
    fetchFilteredEvents({
      keyword: searchQuery,
      location: selectedLocation,
      categoryId: categoryMap[selectedCategory],
      startDate,
      endDate,
      onlyFavorites,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setOnlyFavorites(false);
    toast.info("Filters cleared.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
    fetchFilteredEvents({
      keyword: "",
      location: "",
      categoryId: null,
      startDate: "",
      endDate: "",
      onlyFavorites: false,
    });
  };

  const handleFavoriteToggle = async (eventId, isFavorite) => {
    if (!token) {
      toast.warn(`Please login to favorite events.`, {
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

      fetchFilteredEvents({
        keyword: searchQuery,
        location: selectedLocation,
        categoryId: categoryMap[selectedCategory],
        startDate,
        endDate,
        onlyFavorites,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDot size={30} color="#712681" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#9030a5] text-white rounded hover:bg-[#751d8a] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-[#712681] focus:border-2 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="h-[48px] w-[48px] flex items-center justify-center rounded bg-[#9030a5] text-white hover:bg-[#751d8a] shadow-md transition"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9030a5] text-white hover:bg-[#751d8a] shadow-md transition"
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 border border-gray-300 rounded-xl p-6 bg-white shadow-md space-y-6">
          {/* Location Filter */}
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">
              Filter by Location
            </h3>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-[#712681] focus:border-2 focus:outline-none"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">
              Filter by Category
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-[#712681] focus:border-2 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">
              Filter by Date Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-[#712681] focus:border-2 focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded p-3 bg-white border border-gray-300 hover:border-black focus:border-[#712681] focus:border-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Favorites Filter */}
          {role !== "ORGANIZER" && (
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-800 font-medium">
                  Show only favorites
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={onlyFavorites}
                    onChange={() => setOnlyFavorites(!onlyFavorites)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-[#9030a5] transition"></div>
                  <div className="absolute top-0 left-0 w-6 h-6 bg-white border-none rounded-full shadow transform peer-checked:translate-x-6 transition"></div>
                </div>
              </label>
            </div>
          )}

          {/* Apply & Clear Filter Button */}
          <div className="flex justify-between flex-wrap gap-4">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 font-medium shadow transition"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={!isFilterActive}
              className={`px-4 py-2 rounded font-medium shadow transition ${
                isFilterActive
                  ? "bg-[#9030a5] text-white hover:bg-[#751d8a]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const toggleFavorite = () =>
              handleFavoriteToggle(event.id, event.favorite);

            return (
              <EventCard
                key={event.id}
                event={event}
                buttonColor="bg-[#9030a5] hover:bg-[#751d8a]"
                onFavoriteToggle={toggleFavorite}
              />
            );
          })
        ) : (
          <p className="mt-4 text-center text-gray-500">
            {onlyFavorites
              ? "You haven't marked any events as favorites yet."
              : "No events match your filters."}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventList;
