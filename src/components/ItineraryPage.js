import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaCity,
  FaSpinner,
  FaRoute,
  FaInfoCircle,
  FaArrowLeft,
  FaCalendarAlt,
  FaCompass,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import LiveRoute from "./LiveRoute";

// ---------------- Styled Components (unchanged) ----------------
const MainContainer = styled.div`
  display: flex;
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex: 1;
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const RouteInfo = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RouteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: white;
  font-size: 1.1rem;
  flex-wrap: wrap;
`;

const Location = styled.span`
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 15px;
`;

const Arrow = styled.span`
  font-size: 1.5rem;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-top: 1rem;
`;

const DaySection = styled.div`
  margin-bottom: 3rem;
`;

const DayHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DayTitle = styled.h2`
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
`;

const DayDate = styled.div`
  color: #4a5568;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlaceCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ItinerariesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const DistanceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 1;
  backdrop-filter: blur(10px);
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  padding: 0.4rem 0.9rem;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.85rem;
  z-index: 1;
  text-transform: capitalize;
`;

const Image = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Name = styled.h3`
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Description = styled.p`
  color: #4a5568;
  margin: 1rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MapButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: white;
  gap: 1.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 3rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled(FaCompass)`
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const EmptyStateText = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.h2`
  color: #ef4444;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

// ---------------- Main Component ----------------
function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [dayWisePlaces, setDayWisePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const { startLocation, destination, startDate, endDate, startCoords, destCoords, plan_id } = location.state || {};

  // Calculate number of days for the trip
  const calculateDays = () => {
    if (!startDate || !endDate) return 3;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  // Divide places into days based on distance from start
  const dividePlacesIntoDays = (places, numDays) => {
    if (!places || places.length === 0) return [];
    
    const placesPerDay = Math.ceil(places.length / numDays);
    const days = [];

    for (let i = 0; i < numDays; i++) {
      const startIndex = i * placesPerDay;
      const endIndex = Math.min(startIndex + placesPerDay, places.length);
      const dayPlaces = places.slice(startIndex, endIndex);
      
      if (dayPlaces.length > 0) {
        days.push({
          dayNumber: i + 1,
          date: getDateForDay(i),
          places: dayPlaces
        });
      }
    }

    return days;
  };

  // Get date for specific day
  const getDateForDay = (dayIndex) => {
    if (!startDate) return null;
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  // Save itineraries to database
  const saveItinerariesToDatabase = async (itinerariesData) => {
    try {
      const token = localStorage.getItem("access");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        plan_id: plan_id,
        start_location: startLocation,
        destination: destination,
        start_date: startDate,
        end_date: endDate,
        itineraries: itinerariesData
      };

      const response = await fetch("http://127.0.0.1:8000/api/travel/save-plan-itineraries/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Itineraries saved successfully:", data);
      } else {
        console.warn("Failed to save itineraries:", data);
      }
    } catch (err) {
      console.error("Error saving itineraries to database:", err);
    }
  };

  useEffect(() => {
    if (!startLocation || !destination) {
      setErrorMsg("Missing travel plan details. Please go back and create a plan.");
      setLoading(false);
      return;
    }

    const fetchItineraries = async () => {
      try {
        let finalStartCoords = startCoords;
        let finalDestCoords = destCoords;

        // If coordinates weren't passed, fetch them
        if (!finalStartCoords || !finalStartCoords.lat) {
          console.log("Fetching start coordinates...");
          finalStartCoords = await getCoordinates(startLocation);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!finalDestCoords || !finalDestCoords.lat) {
          console.log("Fetching destination coordinates...");
          finalDestCoords = await getCoordinates(destination);
        }

        if (!finalStartCoords.lat || !finalDestCoords.lat) {
          setErrorMsg("Could not find coordinates for the locations. Please try different location names.");
          setLoading(false);
          return;
        }

        console.log("Fetching route itineraries...");

        // Fetch itineraries along the route
        const response = await fetch(
          `http://127.0.0.1:8000/api/travel/route-itineraries/?start_lat=${finalStartCoords.lat}&start_lon=${finalStartCoords.lon}&dest_lat=${finalDestCoords.lat}&dest_lon=${finalDestCoords.lon}`
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        
        const itinerariesData = data.itineraries || data || [];
        
        // Filter out generic viewpoints and scenic spots
        const filteredItineraries = itinerariesData.filter(item => {
          const name = item.name.toLowerCase();
          return !name.includes('scenic spot') && 
                 !name.includes('viewpoint') && 
                 !name.includes('view point');
        });
        
        setItineraries(filteredItineraries);

        // Divide places into days
        const numDays = calculateDays();
        const dayWise = dividePlacesIntoDays(filteredItineraries, numDays);
        setDayWisePlaces(dayWise);

        // Save to database after successfully fetching
        if (filteredItineraries.length > 0) {
          await saveItinerariesToDatabase(filteredItineraries);
        }

      } catch (err) {
        console.error("Error fetching itineraries:", err);
        setErrorMsg(`Failed to load itineraries: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [startLocation, destination, startCoords, destCoords]);

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

  const handleBack = () => {
    navigate("/personalize-plan");
  };

  const getDayIcon = (dayNumber) => {
    return dayNumber % 2 === 0 ? <FaMoon /> : <FaSun />;
  };

  if (loading) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <LoadingContainer>
              <LoadingSpinner />
              <h2>Finding amazing places along your route...</h2>
              <p style={{ opacity: 0.8 }}>This may take a moment</p>
            </LoadingContainer>
          </ContentWrapper>
        </PageContainer>
      </MainContainer>
    );
  }

  if (errorMsg) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <BackButton onClick={handleBack}>
              <FaArrowLeft /> Back to Plan
            </BackButton>
            <ErrorContainer>
              <ErrorTitle>
                <FaInfoCircle /> Oops!
              </ErrorTitle>
              <ErrorMessage>{errorMsg}</ErrorMessage>
              <RetryButton onClick={handleBack}>
                <FaArrowLeft /> Try Again
              </RetryButton>
            </ErrorContainer>
          </ContentWrapper>
        </PageContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Sidebar />
      <PageContainer>
        <ContentWrapper>
          {selectedDestination ? (
            <LiveRoute
              destination={selectedDestination}
              destinationName={selectedName}
              onBack={() => {
                setSelectedDestination(null);
                setSelectedName("");
              }}
            />
          ) : (
            <>
              <BackButton onClick={handleBack}>
                <FaArrowLeft /> Back to Plan
              </BackButton>

              <Header>
                <Title>
                  <FaRoute /> Your Travel Itinerary
                </Title>
                <RouteInfo>
                  <RouteRow>
                    <Location>{startLocation}</Location>
                    <Arrow>→</Arrow>
                    <Location>{destination}</Location>
                  </RouteRow>
                  {startDate && endDate && (
                    <DateInfo>
                      <FaCalendarAlt />
                      {new Date(startDate).toLocaleDateString()} -{" "}
                      {new Date(endDate).toLocaleDateString()}
                    </DateInfo>
                  )}
                </RouteInfo>
                <Subtitle>
                  {itineraries.length > 0
                    ? `${dayWisePlaces.length}-day journey with ${itineraries.length} amazing places`
                    : "Explore attractions on your journey"}
                </Subtitle>
              </Header>

              {itineraries.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon />
                  <EmptyStateTitle>No attractions found</EmptyStateTitle>
                  <EmptyStateText>
                    We couldn't find any tourist attractions along this route. Try a
                    different destination or explore nearby places instead.
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <>
                  {dayWisePlaces.map((day) => (
                    <DaySection key={day.dayNumber}>
                      <DayHeader>
                        <DayTitle>
                          {getDayIcon(day.dayNumber)}
                          Day {day.dayNumber}
                        </DayTitle>
                        {day.date && (
                          <DayDate>
                            <FaCalendarAlt />
                            {day.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </DayDate>
                        )}
                        <PlaceCount>
                          {day.places.length} {day.places.length === 1 ? 'Place' : 'Places'}
                        </PlaceCount>
                      </DayHeader>

                      <ItinerariesGrid>
                        {day.places.map((item, index) => (
                          <Card key={item.id || index}>
                            <DistanceBadge>
                              <FaMapMarkerAlt />
                              {item.distance} km
                            </DistanceBadge>
                            {item.category && (
                              <CategoryBadge>
                                {item.category.replace("_", " ")}
                              </CategoryBadge>
                            )}
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/seed/${item.name}/400/300`;
                              }}
                            />
                            <Content>
                              <Name>{item.name}</Name>
                              <InfoRow>
                                <FaCity />
                                {item.location || item.city || "Unknown location"}
                              </InfoRow>
                              <Description>{item.description}</Description>
                              <MapButton
                                onClick={() => {
                                  setSelectedDestination([item.lat, item.lon]);
                                  setSelectedName(item.name);
                                }}
                              >
                                <FaMapMarkerAlt /> Get Directions
                              </MapButton>
                            </Content>
                          </Card>
                        ))}
                      </ItinerariesGrid>
                    </DaySection>
                  ))}
                </>
              )}
            </>
          )}
        </ContentWrapper>
      </PageContainer>
    </MainContainer>
  );
}

export default ItineraryPage;