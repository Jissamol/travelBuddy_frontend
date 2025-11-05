import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaRuler,
  FaSpinner,
  FaArrowLeft,
  FaPlay,
  FaStop,
  FaLocationArrow,
  FaClock,
  FaDirections,
  FaVolumeUp,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polyline, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ---------------- Styled Components ----------------
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0f172a;
  padding: 0;
`;

const TopNav = styled.div`
  background: rgba(22, 46, 102, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(22, 46, 102, 0.95);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const DestinationInfo = styled.div`
  flex: 1;
  text-align: center;
  margin: 0 1rem;
`;

const DestName = styled.h1`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MapSection = styled.div`
  position: relative;
  height: calc(100vh - 280px);
  width: 100%;
  
  @media (max-width: 768px) {
    height: calc(100vh - 320px);
  }
`;

const CurrentInstruction = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 90%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const InstructionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const InstructionText = styled.div`
  flex: 1;
`;

const InstructionDistance = styled.div`
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const InstructionDetail = styled.div`
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 600;
`;

const BottomPanel = styled.div`
  background: #1e293b;
  padding: 1.5rem;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
`;

const QuickStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.5rem;
  gap: 0.8rem;
`;

const StatBox = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ActionButton = styled.button`
  width: 100%;
  background: ${({ active }) => 
    active 
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  };
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => 
    active 
      ? '0 4px 15px rgba(239, 68, 68, 0.4)' 
      : '0 4px 15px rgba(16, 185, 129, 0.4)'
  };

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ active }) => 
      active 
        ? '0 6px 20px rgba(239, 68, 68, 0.5)' 
        : '0 6px 20px rgba(16, 185, 129, 0.5)'
    };
  }

  &:active {
    transform: translateY(0);
  }
`;

const VoiceIndicator = styled.div`
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 0.4rem 0.7rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0f172a;
  gap: 1.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  font-size: 3rem;
  color: #3b82f6;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
`;

const LoadingSubtext = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
`;

// ---------------- LiveRoute Component ----------------
function LiveRoute({ destination, destinationName, onBack }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nextInstruction, setNextInstruction] = useState(null);
  const [distanceToNext, setDistanceToNext] = useState(null);
  const watchIdRef = useRef(null);
  const lastAnnouncedStep = useRef(-1);

  // Modern user location marker
  const userIcon = new L.DivIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
      "></div>
      <div style="
        width: 60px;
        height: 60px;
        background: rgba(108, 130, 165, 0.15);
        border: 2px solid rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        position: absolute;
        top: -20px;
        left: -20px;
        animation: pulse 2s ease-out infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Destination marker
  const destIcon = new L.DivIcon({
    className: 'custom-dest-marker',
    html: `
      <div style="
        width: 32px;
        height: 40px;
        background: #ef4444;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 12px rgba(239, 68, 68, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 16px;
          transform: rotate(45deg);
          margin-top: -5px;
          margin-left: -1px;
        "></div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });

  const fetchRoute = async (start, end) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&steps=true`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        setRoute(coords);
        setDistance((data.routes[0].distance / 1000).toFixed(1));
        setDuration(Math.round(data.routes[0].duration / 60));
        
        const routeSteps = data.routes[0].legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction || getManeuverInstruction(step.maneuver),
          distance: step.distance,
          location: [step.maneuver.location[1], step.maneuver.location[0]]
        }));
        setSteps(routeSteps);
      }
    } catch (err) {
      console.error("Route fetch error:", err);
    }
  };

  const getManeuverInstruction = (maneuver) => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    
    if (type === 'depart') return 'Head ' + (modifier || 'straight');
    if (type === 'arrive') return 'You have arrived at your destination';
    if (type === 'turn') {
      if (modifier === 'left') return 'Turn left';
      if (modifier === 'right') return 'Turn right';
      if (modifier === 'sharp left') return 'Sharp left turn';
      if (modifier === 'sharp right') return 'Sharp right turn';
      if (modifier === 'slight left') return 'Slight left';
      if (modifier === 'slight right') return 'Slight right';
    }
    if (type === 'merge') return 'Merge';
    if (type === 'roundabout') return 'Enter the roundabout';
    if (type === 'continue') return 'Continue straight';
    
    return 'Continue on route';
  };

  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkAndAnnounceNextStep = (currentPos) => {
    if (!tracking || steps.length === 0) return;

    for (let i = currentStepIndex; i < steps.length; i++) {
      const step = steps[i];
      const distToStep = calculateDistance(
        currentPos[0], currentPos[1],
        step.location[0], step.location[1]
      );

      setNextInstruction(step.instruction);
      setDistanceToNext(Math.round(distToStep));

      if (distToStep < 100 && lastAnnouncedStep.current !== i) {
        const distanceText = distToStep < 50 ? 'Now' : `In ${Math.round(distToStep)} meters`;
        speakInstruction(`${distanceText}, ${step.instruction}`);
        lastAnnouncedStep.current = i;
        setCurrentStepIndex(i);
        break;
      }
    }
  };

  const startTracking = () => {
    setTracking(true);
    speakInstruction("Navigation started. Follow the route.");
    
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(coords);
          fetchRoute(coords, destination);
          checkAndAnnounceNextStep(coords);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  };

  const stopTracking = () => {
    setTracking(false);
    speakInstruction("Navigation stopped.");
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(coords);
          fetchRoute(coords, destination);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
    
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [destination]);

  if (!currentPosition) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Getting your location...</LoadingText>
        <LoadingSubtext>Please allow location access to continue</LoadingSubtext>
      </LoadingContainer>
    );
  }

  return (
    <PageWrapper>
      <TopNav>
        <BackButton onClick={onBack}>
          <FaArrowLeft /> Back
        </BackButton>
        <DestinationInfo>
          <DestName>{destinationName}</DestName>
        </DestinationInfo>
        <div style={{ width: '80px' }}></div>
      </TopNav>

      <MapSection>
        {tracking && nextInstruction && (
          <CurrentInstruction>
            <InstructionIcon>
              <FaDirections />
            </InstructionIcon>
            <InstructionText>
              <InstructionDistance>{distanceToNext}m</InstructionDistance>
              <InstructionDetail>{nextInstruction}</InstructionDetail>
            </InstructionText>
          </CurrentInstruction>
        )}

        <MapContainer 
          center={currentPosition} 
          zoom={16} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
            maxZoom={19}
          />
          <TileLayer 
            url="https://{s}.tiles.openptmap.org/nok/{z}/{x}/{y}.png"
            maxZoom={17}
            opacity={0.7}
          />
          <ZoomControl position="bottomright" />
          
          <Marker position={currentPosition} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          
          {destination && (
            <Marker position={destination} icon={destIcon}>
              <Popup>{destinationName}</Popup>
            </Marker>
          )}
          
          {route.length > 0 && (
            <>
              <Polyline 
                positions={route} 
                color="#3b82f6" 
                weight={7} 
                opacity={0.9}
              />
              <Polyline 
                positions={route} 
                color="#60a5fa" 
                weight={4} 
                opacity={0.6}
              />
            </>
          )}
        </MapContainer>
      </MapSection>

      <BottomPanel>
        <QuickStats>
          <StatBox>
            <StatValue>{distance || '---'}</StatValue>
            <StatLabel>KM Left</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{duration || '---'}</StatValue>
            <StatLabel>Minutes</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{distanceToNext || '---'}</StatValue>
            <StatLabel>Next Turn (m)</StatLabel>
          </StatBox>
        </QuickStats>

        {tracking && (
          <VoiceIndicator>
            <FaVolumeUp />
            Voice guidance active
          </VoiceIndicator>
        )}
        
        <ActionButton active={tracking} onClick={tracking ? stopTracking : startTracking}>
          {tracking ? (
            <>
              <FaStop /> Stop Navigation
            </>
          ) : (
            <>
              <FaPlay /> Start Navigation
            </>
          )}
        </ActionButton>
      </BottomPanel>
    </PageWrapper>
  );
}

export default LiveRoute;