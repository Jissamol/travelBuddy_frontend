import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddItineraryPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    day_number: "",
    activity: "",
    location: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    fetch(`http://localhost:8000/api/travel/plans/${planId}/itineraries/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add itinerary");
        return res.json();
      })
      .then(() => navigate(`/plans/${planId}/itineraries`))
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add Itinerary for Plan #{planId}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input
          type="number"
          name="day_number"
          placeholder="Day Number"
          value={formData.day_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="activity"
          placeholder="Activity"
          value={formData.activity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
        />
        <button type="submit" style={{ padding: "0.7rem", background: "#1e3c72", color: "white", border: "none", borderRadius: "5px" }}>
          Add Itinerary
        </button>
      </form>
    </div>
  );
}

export default AddItineraryPage;
