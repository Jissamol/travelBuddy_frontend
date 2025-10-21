import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPaperPlane, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import Sidebar from "./Sidebar"; // ✅ Import Sidebar

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
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
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
`;

const LocationButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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
`;

const SuggestionItem = styled.li`
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
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

  // ✅ Fetch autocomplete suggestions
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
      const formatted = data.map((item) => ({ description: item.display_name }));
      setSuggestions((prev) => ({ ...prev, [field]: formatted }));
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // ✅ Use current location
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

  // ✅ Handle input typing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "startLocation" || name === "destination") {
      fetchSuggestions(value, name);
    }
  };

  // ✅ Handle suggestion click
  const handleSuggestionClick = (field, suggestion) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion.description }));
    setSuggestions((prev) => ({ ...prev, [field]: [] }));
  };

  // ✅ Submit to backend
  // ✅ Submit to backend
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/travel/personalize-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Travel plan saved successfully!");
      setMessageType("success");

      // 🔥 Call itinerary generation API right after saving
      const itineraryRes = await fetch("http://127.0.0.1:8000/api/travel/generate-itinerary/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const itineraryData = await itineraryRes.json();

      // ✅ Navigate to itinerary page with data
      navigate("/itinerary", { state: { itinerary: itineraryData.itinerary } });
    } else {
      setMessage(data.detail || "Failed to save travel plan.");
      setMessageType("error");
    }
  } catch (error) {
    setMessage("An error occurred while saving the travel plan.");
    setMessageType("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <PageContainer>
      {/* ✅ Sidebar on the left */}
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      {/* ✅ Main content on the right */}
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
              <FaPaperPlane />
              {loading ? "Saving..." : "Save Plan"}
            </SubmitButton>

            {message && <Message type={messageType}>{message}</Message>}
          </form>
        </FormCard>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PersonalizePlan;
