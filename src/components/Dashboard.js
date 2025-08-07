import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components'; // Removed keyframes as it's not used
// import { FaPlane, FaHotel, FaMapMarkedAlt, FaChartLine, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';
// import { MdOutlineBeachAccess, MdOutlineExplore, MdOutlineLocalOffer } from 'react-icons/md';
// Styled Components
import { FaPlane, FaHotel, FaMapMarkedAlt, FaChartLine, FaSignOutAlt, FaPlusCircle, FaGlobeAmericas } from 'react-icons/fa';
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f5f9fc;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Navbar = styled.nav`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavBrand = styled.h3`
  margin: 0;
  font-size: 1.5rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.8);
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  color: #1e3c72;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }

  div {
    margin-bottom: 10px;
  }

  h2 {
    font-size: 2.2rem;
    margin: 0 0 5px 0;
    color: #1e3c72;
  }

  p {
    font-size: 0.95rem;
    color: #666;
  }
`;

const RecentTripsSection = styled.section`
  margin-bottom: 3rem;
`;

const TripCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TripCard = styled.article`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TripCardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
`;

const TripCardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const TripTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #1e3c72;
  font-size: 1.4rem;
`;

const TripDate = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
`;

const TripDescription = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
  flex-grow: 1;
`;

const AddTripButton = styled.button`
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: fit-content;
  margin: 0 auto; /* Center the button */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(46, 204, 113, 0.4);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 1.5rem;
  color: #1e3c72;
`;

// Styled Components (Rest of your existing styled components remain the same)
// ... (DashboardContainer, Navbar, NavBrand, LogoutButton, MainContent, SectionTitle, StatsGrid, StatCard, RecentTripsSection, TripCardGrid, TripCard, TripCardImage, TripCardContent, TripTitle, TripDate, TripDescription, LoadingContainer)

// Add a new styled component for the Personalized Planning button
const PlanningButton = styled(AddTripButton)` // Inherit styles from AddTripButton
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); /* Purple gradient */
  box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3);

  &:hover {
    box-shadow: 0 6px 12px rgba(155, 89, 182, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem; /* Space between buttons */
  margin-top: 2.5rem;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
`;


// Mock data
const stats = [
  { id: 1, icon: <FaPlane />, value: '12', label: 'Total Trips', color: '#3498db' },
  { id: 2, icon: <FaHotel />, value: '7', label: 'Cities Visited', color: '#e74c3c' },
  { id: 3, icon: <FaMapMarkedAlt />, value: '4', label: 'Active Plans', color: '#2ecc71' },
  { id: 4, icon: <FaChartLine />, value: '85%', label: 'Trip Completion', color: '#f39c12' },
];

const mockTrips = [
  {
    id: 1,
    title: 'European Adventure',
    date: 'July 15 - Aug 5, 2024',
    description: 'Explored the vibrant cities and historical sites of Paris, Rome, and Berlin.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898665-ec395cc91338?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    title: 'Southeast Asian Getaway',
    date: 'May 10 - May 25, 2024',
    description: 'Relaxed on the beaches of Thailand and explored the ancient temples of Cambodia.',
    imageUrl: 'https://images.unsplash.com/photo-1518840244101-52ed16f87ea5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    title: 'Mountains & Lakes Trek',
    date: 'April 1 - April 10, 2024',
    description: 'Hiked through breathtaking mountain trails and enjoyed serene lakeside views.',
    imageUrl: 'https://images.unsplash.com/photo-1542171225-ee531e2479e0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('http://127.0.0.1:8000/api/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Simulate loading trips (replace with actual API call)
        const tripsResponse = await new Promise(resolve => 
          setTimeout(() => resolve(mockTrips), 500)
        );
        setTrips(tripsResponse);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  if (loading) {
    return (
      <LoadingContainer>
        Loading Dashboard...
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <Navbar>
        <NavBrand>Travel Planner</NavBrand>
        <NavBrand>Welcome back, {userData?.username}!</NavBrand>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Sign Out
        </LogoutButton>
      </Navbar>

      <MainContent>
        <SectionTitle>Your Travel Summary</SectionTitle>
        <StatsGrid>
          {stats.map(stat => (
            <StatCard key={stat.id}>
              <div style={{ color: stat.color, fontSize: '2.5rem' }}>
                {stat.icon}
              </div>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </StatCard>
          ))}
        </StatsGrid>

        <RecentTripsSection>
          <SectionTitle>Recent Trips</SectionTitle>
          <TripCardGrid>
            {trips.length > 0 ? (
              trips.map(trip => (
                <TripCard key={trip.id}>
                  <TripCardImage src={trip.imageUrl} alt={trip.title} />
                  <TripCardContent>
                    <TripTitle>{trip.title}</TripTitle>
                    <TripDate>{trip.date}</TripDate>
                    <TripDescription>{trip.description}</TripDescription>
                  </TripCardContent>
                </TripCard>
              ))
            ) : (
              <p>No recent trips found. Start planning your next adventure!</p>
            )}
          </TripCardGrid>
          <ButtonGroup>
            <AddTripButton onClick={() => navigate('/add-trip')}>
              <FaPlusCircle /> Add New Trip
            </AddTripButton>
            <PlanningButton onClick={() => navigate('/personalize-plan')}> {/* New button */}
              <FaGlobeAmericas /> Personalized Planning
            </PlanningButton>
          </ButtonGroup>
        </RecentTripsSection>

      </MainContent>
    </DashboardContainer>
  );
}

export default Dashboard;