import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPaperPlane, FaTimes, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import Sidebar from "./Sidebar";

// ---------------- Styled Components ----------------
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f7f8fc;
`;

const SidebarWrapper = styled.div`
  width: 260px;
  background: #fff;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const LocationButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f0f0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #218838;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  background: ${({ type }) => (type === "error" ? "#f8d7da" : "#d4edda")};
  color: ${({ type }) => (type === "error" ? "#721c24" : "#155724")};
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// ---------------- Component ----------------
function PersonalizePlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startLocation: "",
    destination: "",
    startDate: "",
    endDate: "",
    groupType: "solo",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [suggestions, setSuggestions] = useState({
    startLocation: [],
    destination: [],
  });

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (query, field) => {
    if (!query) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5&countrycodes=in`
      );
      const data = await res.json();
      const formatted = data.map((item) => ({
        description: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
      setSuggestions((prev) => ({ ...prev, [field]: formatted }));
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Use current location
  const handleUseMyLocation = async (field) => {
    if (formData[field]) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=in`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          setFormData((prev) => ({ ...prev, [field]: address }));
        } catch (err) {
          alert("Failed to fetch location details.");
        }
      },
      (error) => {
        if (error.code === 1) {
          alert("Permission denied. Please allow location access.");
        } else {
          alert("Unable to retrieve your location.");
        }
      }
    );
  };

  // Handle input typing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "startLocation" || name === "destination") {
      fetchSuggestions(value, name);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (field, suggestion) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion.description }));
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  // Helper function to get coordinates for a location
  const getCoordinates = async (locationName) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}&limit=1`,
        {
          headers: {
            'User-Agent': 'TravelBuddyApp/1.0'
          }
        }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
    }
    return { lat: null, lon: null };
  };

// inside PersonalizePlan, update AChandleSubmit's saving logic
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    setMessage("Getting location coordinates...");
    setMessageType("success");

    const startCoords = await getCoordinates(formData.startLocation);
    await new Promise(resolve => setTimeout(resolve, 1000)); // rate limit
    const destCoords = await getCoordinates(formData.destination);

    if (!startCoords.lat || !destCoords.lat) {
      setMessage("Could not find coordinates for the locations. Please try different location names.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    // Build payload (include coords)
    const payload = {
      startLocation: formData.startLocation,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      start_lat: startCoords.lat,
      start_lon: startCoords.lon,
      dest_lat: destCoords.lat,
      dest_lon: destCoords.lon,
      groupType: formData.groupType || "solo",
    };

    setMessage("Saving your plan...");
    setMessageType("success");

    // Try to POST the plan (authenticated if token present)
    const token = localStorage.getItem("access");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let savedPlanId = null;
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/travel/personalize-plan/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Parse response if possible
      const data = await resp.json().catch(() => ({}));
      if (resp.status === 201 || resp.ok) {
        // prefer plan_id if view returns it, else try `id`
        savedPlanId = data.plan_id || data.id || data.pk || null;
        // if serializer returned whole object but no id, try to read serializer data
        if (!savedPlanId && data && typeof data === "object") {
          if (data.id) savedPlanId = data.id;
        }
      } else if (resp.status === 401) {
        // token expired — remove and continue as guest
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } else {
        console.warn("Plan save returned non-OK:", resp.status, data);
      }
    } catch (err) {
      console.error("Error saving plan to backend:", err);
      // proceed as guest if backend down
    }

    setMessage("Loading your travel itinerary...");
    setMessageType("success");

    // Pass plan_id (can be null) and coordinates to itinerary route
    navigate("/itinerary", {
      state: {
        ...formData,
        startCoords,
        destCoords,
        plan_id: savedPlanId,
      },
    });

  } catch (error) {
    console.error("Error:", error);
    setMessage("An error occurred while processing your request.");
    setMessageType("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <PageContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <ContentWrapper>
        <FormCard>
          <CloseButton onClick={() => navigate("/dashboard")}>
            <FaTimes />
          </CloseButton>
          <FormTitle>Personalize Your Travel Plan</FormTitle>

          <form onSubmit={handleSubmit}>
            {/* Starting Location */}
            <FormGroup>
              <Label>Starting Location</Label>
              <InputWrapper>
                <Input
                  type="text"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleInputChange}
                  placeholder="Enter starting location"
                  autoComplete="off"
                  required
                />
                <LocationButton
                  type="button"
                  onClick={() => handleUseMyLocation("startLocation")}
                >
                  {formData.startLocation ? <FaTimes /> : <FaMapMarkerAlt />}
                </LocationButton>
              </InputWrapper>
              {suggestions.startLocation.length > 0 && (
                <SuggestionsList>
                  {suggestions.startLocation.map((s, idx) => (
                    <SuggestionItem
                      key={idx}
                      onClick={() => handleSuggestionClick("startLocation", s)}
                    >
                      {s.description}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
            </FormGroup>

            {/* Destination */}
            <FormGroup>
              <Label>Destination</Label>
              <InputWrapper>
                <Input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Enter destination"
                  autoComplete="off"
                  required
                />
                <LocationButton
                  type="button"
                  onClick={() => handleUseMyLocation("destination")}
                >
                  {formData.destination ? <FaTimes /> : <FaMapMarkerAlt />}
                </LocationButton>
              </InputWrapper>
              {suggestions.destination.length > 0 && (
                <SuggestionsList>
                  {suggestions.destination.map((s, idx) => (
                    <SuggestionItem
                      key={idx}
                      onClick={() => handleSuggestionClick("destination", s)}
                    >
                      {s.description}
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
            </FormGroup>

            {/* Dates */}
            <FormGroup>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>End Date</Label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            {/* Submit */}
            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Processing...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Plan My Trip
                </>
              )}
            </SubmitButton>

            {message && <Message type={messageType}>{message}</Message>}
          </form>
        </FormCard>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PersonalizePlan;