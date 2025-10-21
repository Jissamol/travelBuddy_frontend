import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.div`
  padding: 2rem;
  background: #f7f8fc;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const itinerary = location.state?.itinerary || {};

  return (
    <Page>
      <button onClick={() => navigate("/dashboard")}>⬅ Back</button>
      <h1>Your Travel Itinerary</h1>

      {itinerary.days ? (
        itinerary.days.map((day, idx) => (
          <Card key={idx}>
            <Title>{day.title}</Title>
            <ul>
              {day.activities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Card>
        ))
      ) : (
        <p>No structured itinerary found. Raw response: {JSON.stringify(itinerary)}</p>
      )}
    </Page>
  );
}

export default ItineraryPage;
