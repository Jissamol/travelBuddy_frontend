import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaCity, FaRuler } from "react-icons/fa";

// ---------------- Styled Components ----------------
const PageContainer = styled.div`
  padding: 2rem;
  background: #f7f8fc;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const ItinerariesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1rem;
  flex: 1;
`;

const Name = styled.h3`
  margin: 0.5rem 0;
  color: #1a202c;
`;

const LocationInfo = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #5a67d8;
  margin: 0.25rem 0;
  gap: 0.3rem;

  svg {
    margin-right: 5px;
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.75rem;
  line-height: 1.4;
`;

const MapButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #0056b3;
  }
`;

const Message = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
  color: ${({ error }) => (error ? "red" : "green")};
`;

// ---------------- Component ----------------
function TopItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `http://localhost:8000/api/travel/nearby-itineraries/?lat=${lat}&lon=${lon}&radius=50000`
          );

          if (!response.ok) throw new Error("Failed to fetch itineraries");

          const data = await response.json();
          setItineraries(data);
        } catch (err) {
          setErrorMsg(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setErrorMsg("Failed to get your location. Please allow location access.");
        setLoading(false);
      }
    );
  }, []);

  const handleViewMap = (lat, lon) => {
    window.open(`https://maps.google.com/?q=${lat},${lon}`, "_blank");
  };

  if (loading) return <Message>Loading itineraries...</Message>;
  if (errorMsg) return <Message error>{errorMsg}</Message>;

  return (
    <PageContainer>
      <Title>Top 15 Tourist Places Near You</Title>
      <ItinerariesGrid>
        {itineraries.length === 0 ? (
          <Message>No itineraries found nearby.</Message>
        ) : (
          itineraries.map((item) => {
            const locationString = [item.district, item.city]
              .filter(Boolean)
              .join(", ") || "Unknown Location";

            return (
              <Card key={item.id}>
                <Image 
  src={item.image} 
  alt={item.name} 
  loading="lazy"
  onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/400/300?random=${item.id}`; }}
/>

                <Content>
                  <Name>{item.name}</Name>

                  <LocationInfo>
                    <FaCity /> {locationString}
                  </LocationInfo>

                  <LocationInfo>
                    <FaRuler /> {item.distance} km away
                  </LocationInfo>

                  <Description>{item.description}</Description>

                  <MapButton onClick={() => handleViewMap(item.lat, item.lon)}>
                    <FaMapMarkerAlt /> View Map
                  </MapButton>
                </Content>
              </Card>
            );
          })
        )}
      </ItinerariesGrid>
    </PageContainer>
  );
}

export default TopItineraries;
