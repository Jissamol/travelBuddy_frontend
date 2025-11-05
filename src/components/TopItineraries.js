import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaCity,
  FaSpinner,
  FaCompass,
  FaInfoCircle,
  FaLocationArrow,
  FaSearch,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import LiveRoute from "./LiveRoute";

// ---------------- Styled Components ----------------
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

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const SearchBarContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
`;

const SearchBar = styled.div`
  background: white;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #667eea;
  font-size: 1.25rem;
`;

const SearchInput = styled.div`
  flex: 1;
  color: #718096;
  font-size: 1rem;
  user-select: none;
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
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
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

// ---------------- Main Component ----------------
function TopItineraries() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const fetchNearbyPlaces = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`http://localhost:8000/api/travel/nearby-itineraries/?lat=${lat}&lon=${lon}&radius=20000`)
      .then(response => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setItineraries(data);
        setLoading(false);
      })
      .catch(err => {
        setErrorMsg(`Failed to load nearby places: ${err.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      fetchNearbyPlaces,
      () => {
        setErrorMsg("Please allow location access to discover nearby places.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setErrorMsg("");
    navigator.geolocation.getCurrentPosition(
      fetchNearbyPlaces,
      () => {
        setErrorMsg("Please allow location access to discover nearby places.");
        setLoading(false);
      }
    );
  };

  const handleSearchClick = () => {
    navigate("/personalize-plan");
  };

  if (loading) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <LoadingContainer>
              <LoadingSpinner />
              <h2>Discovering amazing places near you...</h2>
              <p style={{ opacity: 0.8 }}>This will only take a moment</p>
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
            <ErrorContainer>
              <ErrorTitle>
                <FaInfoCircle /> Oops!
              </ErrorTitle>
              <ErrorMessage>{errorMsg}</ErrorMessage>
              <RetryButton onClick={handleRetry}>
                <FaLocationArrow /> Try Again
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
              <Header>
                <Title>
                  <FaCompass /> Discover Nearby
                </Title>
                <Subtitle>Explore amazing places around you</Subtitle>
              </Header>

              <SearchBarContainer>
                <SearchBar onClick={handleSearchClick}>
                  <SearchIcon />
                  <SearchInput>Search for destinations...</SearchInput>
                </SearchBar>
              </SearchBarContainer>

              {itineraries.filter(item => {
                const name = item.name.toLowerCase();
                return !name.includes('scenic spot') && !name.includes('viewpoint') && !name.includes('view point');
              }).length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon />
                  <EmptyStateTitle>No places found</EmptyStateTitle>
                  <EmptyStateText>
                    No nearby attractions found at this time
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <ItinerariesGrid>
                  {itineraries.filter(item => {
                    const name = item.name.toLowerCase();
                    return !name.includes('scenic spot') && !name.includes('viewpoint') && !name.includes('view point');
                  }).map((item) => (
                    <Card key={item.id}>
                      <DistanceBadge>
                        <FaMapMarkerAlt />
                        {item.distance} km
                      </DistanceBadge>
                      <Image 
                        src={item.image || "https://via.placeholder.com/400x240"} 
                        alt={item.name} 
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
              )}
            </>
          )}
        </ContentWrapper>
      </PageContainer>
    </MainContainer>
  );
}

export default TopItineraries;