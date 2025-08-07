import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaperPlane, FaTimes } from 'react-icons/fa'; // Added FaTimes for potential close button

// Styled Components
const PersonalizeContainer = styled.div`
  min-height: 100vh;
  background: #f5f9fc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  padding: 2.5rem 3rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const FormTitle = styled.h2`
  color: #1e3c72;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box; /* Include padding in width */
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2a5298;
    box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  background-color: white; /* Ensure consistent background */
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;

  &:focus {
    outline: none;
    border-color: #2a5298;
    box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(46, 204, 113, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const StatusMessage = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: ${props => props.type === 'success' ? '#27ae60' : '#e74c3c'};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #666;
  }
`;


function PersonalizePlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startLocation: '', // Added startLocation
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    groupType: 'solo',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    // Pre-condition check: user must be logged in.
    // In a real app, you'd verify the token here as well
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    // Form validation (basic example)
    if (!formData.startLocation || !formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // Simulate sending data to your backend/AI module
      // In a real application, you would send this data to your API:
      // const response = await fetch('/api/travel-preferences', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('access')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to submit preferences');
      // }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay

      // Output: Confirmation of preference submission
      setMessage('Your preferences have been submitted successfully! We will generate a customized itinerary for you.');
      setMessageType('success');

      // Post-condition: Preference saved in database (simulated)
      console.log('Preferences submitted:', formData);

      // Optionally, clear form or redirect after success
      setFormData({
        startLocation: '', // Clear startLocation
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        groupType: 'solo',
      });

    } catch (error) {
      console.error("Error submitting preferences:", error);
      setMessage(`Error: ${error.message || 'Failed to submit preferences. Please try again.'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonalizeContainer>
      <FormCard style={{ position: 'relative' }}>
        <CloseButton onClick={() => navigate('/dashboard')}>
          <FaTimes />
        </CloseButton>
        <FormTitle>Personalize Your Travel Plan</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="startLocation">Starting Location</Label>
            <Input
              type="text"
              id="startLocation"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              placeholder="e.g., New York, London, Your City"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="destination">Destination</Label>
            <Input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Paris, Japan, Coastal California"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="budget">Budget (e.g., USD)</Label>
            <Input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., 2000"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="groupType">Type of Group</Label>
            <Select
              id="groupType"
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
            >
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family with Kids</option>
              <option value="friends">Friends</option>
              <option value="large-group">Large Group</option>
            </Select>
          </FormGroup>

          {/* Interests (comma-separated) - REMOVED AS REQUESTED */}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Submitting...' : (
              <>
                <FaPaperPlane /> Submit Preferences
              </>
            )}
          </SubmitButton>

          {message && <StatusMessage type={messageType}>{message}</StatusMessage>}
        </form>
      </FormCard>
    </PersonalizeContainer>
  );
}

export default PersonalizePlan;