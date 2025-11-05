import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaCalendarAlt, FaSun, FaMoon, FaArrowLeft, FaExclamationTriangle, FaRoute } from "react-icons/fa";
import Sidebar from "./Sidebar";

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
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const DaySection = styled.div`
  margin-bottom: 3rem;
`;

const DayHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DayHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const PlanInfo = styled.div`
  color: #4a5568;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RouteText = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const DayDate = styled.div`
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const PlaceCount = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 600;
`;

const ItinerariesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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
  font-size: 0.85rem;
  z-index: 1;
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
  height: 220px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Name = styled.h3`
  color: #1a202c;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  line-height: 1.3;
`;

const LocationText = styled.p`
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-top: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #e53e3e;
  padding: 1.5rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  margin-top: 2rem;
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
`;

const EmptyMessage = styled.div`
  background: rgba(255, 255, 255, 0.95);
  color: #4a5568;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  &::after {
    content: "";
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatsBar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  
  .label {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .value {
    color: #667eea;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

function AllItinerariesPage({ navigate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDayIcon = (day) => (day % 2 === 0 ? <FaMoon /> : <FaSun />);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching all travel plans...");
        const res = await fetch("http://127.0.0.1:8000/api/travel/allitineraries/");
        
        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        }
        
        const result = await res.json();
        console.log('✅ API Response:', result);
        console.log('📊 Total days:', result.length);
        console.log('📍 Total places:', result.reduce((sum, day) => sum + (day.places?.length || 0), 0));
        
        setData(result);
      } catch (err) {
        console.error("❌ Error fetching itineraries:", err);
        setError(err.message || "Failed to load itineraries.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const totalPlaces = data.reduce((sum, day) => sum + (day.places?.length || 0), 0);
  const totalDays = data.length;
  const uniquePlans = new Set(data.map(d => d.plan_id)).size;

  if (loading) {
    return (
      <MainContainer>
        <Sidebar />
        <PageContainer>
          <ContentWrapper>
            <LoadingSpinner />
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
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </BackButton>

          <Header>
            <Title>All Travel Plans</Title>
            <Subtitle>View all your saved travel itineraries</Subtitle>
          </Header>

          {error ? (
            <ErrorMessage>
              <ErrorHeader>
                <FaExclamationTriangle size={24} />
                <span>{error}</span>
              </ErrorHeader>
            </ErrorMessage>
          ) : data.length === 0 ? (
            <EmptyMessage>
              No travel plans found. Create your first personalized travel plan!
            </EmptyMessage>
          ) : (
            <>
              <StatsBar>
                <StatItem>
                  <div className="label">Total Plans</div>
                  <div className="value">{uniquePlans}</div>
                </StatItem>
                <StatItem>
                  <div className="label">Total Days</div>
                  <div className="value">{totalDays}</div>
                </StatItem>
                <StatItem>
                  <div className="label">Total Places</div>
                  <div className="value">{totalPlaces}</div>
                </StatItem>
              </StatsBar>

              {data.map((day) => (
                <DaySection key={`day-${day.day}-${day.plan_id}`}>
                  <DayHeader>
                    <DayHeaderLeft>
                      <DayTitle>
                        {getDayIcon(day.day)} Day {day.day}
                      </DayTitle>
                      <PlanInfo>
                        <RouteText>
                          <FaRoute />
                          {day.start_location} → {day.destination}
                        </RouteText>
                      </PlanInfo>
                    </DayHeaderLeft>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {day.date && (
                        <DayDate>
                          <FaCalendarAlt /> {formatDate(day.date)}
                        </DayDate>
                      )}
                      <PlaceCount>
                        {day.places?.length || 0} {day.places?.length === 1 ? 'Place' : 'Places'}
                      </PlaceCount>
                    </div>
                  </DayHeader>

                  <ItinerariesGrid>
                    {day.places && day.places.length > 0 ? (
                      day.places.map((place) => (
                        <Card key={`${place.id}-${day.day}`}>
                          {place.distance > 0 && (
                            <DistanceBadge>
                              {place.distance.toFixed(1)} km
                            </DistanceBadge>
                          )}
                          {place.category && (
                            <CategoryBadge>
                              {place.category.replace('_', ' ')}
                            </CategoryBadge>
                          )}
                          <Image
                            src={place.image}
                            alt={place.name}
                            onError={(e) => {
                              e.target.src = `https://picsum.photos/seed/${encodeURIComponent(place.name)}/400/300`;
                            }}
                          />
                          <Content>
                            <Name>{place.name}</Name>
                            <LocationText>
                              <FaMapMarkerAlt /> {place.location}
                            </LocationText>
                            <Description>{place.description}</Description>
                          </Content>
                        </Card>
                      ))
                    ) : (
                      <EmptyMessage>No places for this day</EmptyMessage>
                    )}
                  </ItinerariesGrid>
                </DaySection>
              ))}
            </>
          )}
        </ContentWrapper>
      </PageContainer>
    </MainContainer>
  );
}

export default AllItinerariesPage;