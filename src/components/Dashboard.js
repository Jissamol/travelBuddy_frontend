import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
  const [hasRetried, setHasRetried] = useState(false); // ✅ retry guard

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
          // Try refreshing token only once
          const refreshed = await tryRefreshToken();
          if (refreshed) {
            setHasRetried(true); // ✅ prevent infinite loop
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
  }, [hasRetried]); // ✅ depend on retry state

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
        <p>Here you can see your travel stats and manage trips.</p>
        {/* ✅ Add your dashboard content here */}
      </Content>
    </DashboardWrapper>
  );
}

export default Dashboard;
