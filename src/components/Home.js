import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const HeroSection = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  text-align: center;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(45deg, #00b4db, #0083b0);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    background: linear-gradient(45deg, #0083b0, #00b4db);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #0083b0, #00b4db);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  opacity: 0.9;
  font-size: 1rem;
  line-height: 1.6;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s infinite ease-in-out;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -50px;
    animation-delay: 0s;
  }
  
  &::after {
    width: 200px;
    height: 200px;
    bottom: -80px;
    left: -30px;
    animation-delay: 2s;
  }
`;

function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const features = [
    {
      icon: '✈️',
      title: 'Smart Trip Planning',
      description: 'Get personalized travel recommendations based on your preferences and budget.'
    },
    {
      icon: '🏨',
      title: 'Best Deals',
      description: 'Find and compare the best hotel and flight deals in one place.'
    },
    {
      icon: '🗺️',
      title: 'Local Experiences',
      description: 'Discover hidden gems and local experiences at your destination.'
    }
  ];

  return (
    <HeroSection aria-label="Welcome to Travel Buddy">
      <BackgroundAnimation aria-hidden="true" />
      <ContentWrapper>
        <Title>Your Perfect Travel Adventure Awaits </Title>
        <Subtitle>
          Plan your dream vacation with our AI-powered travel assistant. Get personalized 
          recommendations, the best deals, and create unforgettable memories.
        </Subtitle>
        <CTAButton to="/login" aria-label="Start planning your trip">
          Start Planning Your Journey
        </CTAButton>
        
        <FeaturesGrid>
  {features.map((feature, index) => (
    <FeatureCard to="/login" key={index}>
      <FeatureIcon aria-hidden="true">{feature.icon}</FeatureIcon>
      <FeatureTitle>{feature.title}</FeatureTitle>
      <FeatureDescription>{feature.description}</FeatureDescription>
    </FeatureCard>
  ))}
</FeaturesGrid>
      </ContentWrapper>
    </HeroSection>
  );
}

export default Home;
