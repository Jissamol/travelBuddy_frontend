import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f9fc;
  color: #333;
  font-family: "Arial", sans-serif;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  color: #1e3c72;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 250px;
  padding: 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const NearMeButton = styled(ActionButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #663a8f 100%);
  }
`;

const PersonalizeButton = styled(ActionButton)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #e082ea 0%, #e4465b 100%);
  }
`;

const ButtonIcon = styled.span`
  font-size: 2.5rem;
`;

const ButtonLabel = styled.span`
  font-size: 1.2rem;
`;

const ButtonDescription = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 400;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 1.5rem;
  color: #1e3c72;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-size: 1.2rem;
  color: #dc3545;
`;

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRetried, setHasRetried] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyTokenAndFetchData = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401 && !hasRetried) {
          const refreshed = await tryRefreshToken();
          if (refreshed) {
            setHasRetried(true);
            verifyTokenAndFetchData();
          } else {
            localStorage.clear();
            window.location.href = "/login";
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndFetchData();
  }, [hasRetried]);

  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) return false;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access", data.access);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const handleNearMeClick = () => {
    navigate("/top-itineraries");
  };

  const handlePersonalizeClick = () => {
    navigate("/personalize-plan");
  };

  if (loading) {
    return <LoadingContainer>Loading Dashboard...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error loading dashboard: {error}</ErrorContainer>;
  }

  return (
    <DashboardWrapper>
      <Sidebar />
      <Content>
        <SectionTitle>
          Welcome back, {userData?.username || userData?.first_name || "User"}!
        </SectionTitle>
        <WelcomeText>
          Ready to explore? Choose an option below to start planning your next adventure.
        </WelcomeText>

        <ButtonContainer>
          <NearMeButton onClick={handleNearMeClick}>
            <ButtonIcon>📍</ButtonIcon>
            <ButtonLabel>Near Me</ButtonLabel>
            <ButtonDescription>Discover top itineraries nearby</ButtonDescription>
          </NearMeButton>

          <PersonalizeButton onClick={handlePersonalizeClick}>
            <ButtonIcon>✨</ButtonIcon>
            <ButtonLabel>Personalize</ButtonLabel>
            <ButtonDescription>Create your custom travel plan</ButtonDescription>
          </PersonalizeButton>
        </ButtonContainer>
      </Content>
    </DashboardWrapper>
  );
}

export default Dashboard;