// pages/index.js
import { useState } from 'react';
import axios from 'axios';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

export default function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [tripType, setTripType] = useState('');
  const [budget, setBudget] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDestinations = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const startMonth = startDate.month() + 1; // getMonth() returns 0-indexed month
    const endMonth = endDate.month() + 1;

    setLoading(true);
    try {
      const response = await axios.post('/api/get-destinations', { startMonth, endMonth, tripType, budget });
      setDestinations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Trip planner</h1>
      <div className="form-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          getDestinations();
        }}>
          <label className="form-label">
            Trip type:
            <input className="form-input" type="text" value={tripType} onChange={(e) => setTripType(e.target.value)} required />
          </label>
          <label className="form-label">
            Budget:
            <input className="form-input" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          </label>
          <label className="form-label">
            Date range:
            <DateRangePicker
              startDate={startDate}
              startDateId="your_unique_start_date_id"
              endDate={endDate}
              endDateId="your_unique_end_date_id"
              onDatesChange={({ startDate, endDate }) => {
                setStartDate(startDate);
                setEndDate(endDate);
              }}
              focusedInput={focusedInput}
              onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
              displayFormat="YYYY-MM-DD"
              startDatePlaceholderText="yyyy-mm-dd"
              endDatePlaceholderText="yyyy-mm-dd"
            />
          </label>
          <div className="button-container">
            <button className="submit-button" type="submit">Get Destinations</button>
          </div>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {destinations.length > 0 && (
        <ul>
          {destinations.map((destination, index) => (
            <li key={index}>{destination.destination}, {destination.city}, {destination.country}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
