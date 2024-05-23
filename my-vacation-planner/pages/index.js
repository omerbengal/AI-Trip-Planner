import { useState } from 'react';
import axios from 'axios';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export default function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [tripType, setTripType] = useState('');
  const [budget, setBudget] = useState('');
  const [destinations, setDestinations] = useState({});
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showDestinations, setShowDestinations] = useState(true);


  const getDestinations = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (!tripType) {
      alert('Please select a trip type');
      return;
    }

    setShowButton(false); // Hide the button
    setShowDestinations(true); // Show the buttons again

    setLoading(true);
    try {

      // Call the API, for example: http://127.0.0.1:8000/top-5-options?start_date=2025-01-10&end_date=2025-01-20&trip_type=ski&budget=3000
      const response = await axios.get(`http://127.0.0.1:8000/top-5-options?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&trip_type=${tripType}&budget=${budget}`);
      setDestinations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  const handleClick = (key) => {
    console.log(key);
    setDestinations({ [key]: destinations[key] });
  };

  // Update the event handlers to show the button again when any input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setShowButton(true); // Show the button
    setShowDestinations(false);
  };

  // Update the onDatesChange handler to show the button again when dates change
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setShowButton(true); // Show the button
    setShowDestinations(false);
  };


  return (
    <div>
      <h1>AI Trip Planner</h1>
      <div className="form-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          getDestinations();
        }}>
          <label className="form-label">
            Trip type:
            <input className="form-input" type="text" value={tripType} onChange={handleInputChange(setTripType)} required />
          </label>
          <label className="form-label">
            Budget:
            <input className="form-input" type="text" value={budget} onChange={handleInputChange(setBudget)} required />
          </label>
          <label className="form-label">
            Date range:
            <DateRangePicker
              startDate={startDate}
              startDateId="your_unique_start_date_id"
              endDate={endDate}
              endDateId="your_unique_end_date_id"
              onDatesChange={handleDatesChange}
              focusedInput={focusedInput}
              onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
              displayFormat="YYYY-MM-DD"
              startDatePlaceholderText="yyyy-mm-dd"
              endDatePlaceholderText="yyyy-mm-dd"
            />
          </label>

          {showButton && (
            <div className="button-container">
              <button className="submit-button" type="submit">Get Destinations</button>
            </div>
          )}
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {showDestinations && (
        <div className="button-group">
          {Object.entries(destinations).map(([key, destination], index) => (
            <button key={index} onClick={() => handleClick(key)}>
              <span className="headline">{destination.destination}, {destination.city}, {destination.country}</span> <br />
              {destination.arrival_connections_list.length > 0 && (
                <>
                  <span className="underline">First way flights connections:</span> {destination.arrival_connections_list.join(', ')} <br />
                  <br />
                </>
              )}
              <span className="underline">Arrival time to destination:</span> {destination.arrival_daytime} <br />
              <br />
              {destination.departure_connections_list.length > 0 && (
                <>
                  <span className="underline">Second way flights connections:</span> {destination.departure_connections_list.join(', ')} <br />
                  <br />
                </>
              )}
              <span className="underline">Departure time:</span> {destination.departure_daytime} <br />
              <br />
              <span className="underline">Total flights costs:</span> {destination.flights_total_price} $ <br />
              <br />
              <span className="underline">Hotel:</span> {destination.hotel_name} <br />
              <br />
              <span className="underline">Total hotel price:</span> {destination.hotel_total_price} $ <br />
              <br />
              <span className="underline2">Total trip cost:</span> <text className="totalPrice">{destination.flights_total_price + destination.hotel_total_price} $</text>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

/*

let response = {
        "Val d'Isere@Geneva@Switzerland": {
          "destination": "Val d'Isere",
          "city": "Geneva",
          "country": "Switzerland",
          "arrival_daytime": "2025-01-10 10:45",
          "arrival_total_price": 158.0,
          "arrival_connections_number": "1",
          "arrival_connections_list": [
            "Leonardo da VinciFiumicino Airport"
          ],
          "departure_daytime": "2025-01-20 20:15",
          "departure_total_price": 152.0,
          "departure_connections_number": "1",
          "departure_connections_list": [
            "Zurich Airport"
          ],
          "flights_total_price": 310.0,
          "hotel_name": "Jugendstil-Hotel Paxmontana",
          "hotel_total_price": 1775.0
        },
        "Zermatt@Zurich@Switzerland": {
          "destination": "Zermatt",
          "city": "Zurich",
          "country": "Switzerland",
          "arrival_daytime": "2025-01-10 08:15",
          "arrival_total_price": 151.0,
          "arrival_connections_number": "0",
          "arrival_connections_list": [],
          "departure_daytime": "2025-01-20 11:15",
          "departure_total_price": 169.0,
          "departure_connections_number": "1",
          "departure_connections_list": [
            "Athens International Airport \"Eleftherios Venizelos\""
          ],
          "flights_total_price": 320.0,
          "hotel_name": "Hotel Alpen Resort & SPA",
          "hotel_total_price": 2437.0
        },
        "St Anton@Innsbruck@Austria": {
          "destination": "St Anton",
          "city": "Innsbruck",
          "country": "Austria",
          "arrival_daytime": "2025-01-10 14:50",
          "arrival_total_price": 195.0,
          "arrival_connections_number": "1",
          "arrival_connections_list": [
            "Athens International Airport \"Eleftherios Venizelos\""
          ],
          "departure_daytime": "2025-01-20 14:15",
          "departure_total_price": 157.0,
          "departure_connections_number": "1",
          "departure_connections_list": [
            "Munich International Airport"
          ],
          "flights_total_price": 352.0,
          "hotel_name": "Gafluna",
          "hotel_total_price": 2166.0
        },
        "Courchevel@Lyon@France": {
          "destination": "Courchevel",
          "city": "Lyon",
          "country": "France",
          "arrival_daytime": "2025-01-10 17:45",
          "arrival_total_price": 190.0,
          "arrival_connections_number": "1",
          "arrival_connections_list": [
            "Josep Tarradellas Barcelona-El Prat Airport"
          ],
          "departure_daytime": "2025-01-20 17:00",
          "departure_total_price": 141.0,
          "departure_connections_number": "1",
          "departure_connections_list": [
            "Josep Tarradellas Barcelona-El Prat Airport"
          ],
          "flights_total_price": 331.0,
          "hotel_name": "Crowne Plaza Paris - Republique, an IHG Hotel",
          "hotel_total_price": 2669.0
        },
        "Verbier@Geneva@Switzerland": {
          "destination": "Verbier",
          "city": "Geneva",
          "country": "Switzerland",
          "arrival_daytime": "2025-01-10 10:45",
          "arrival_total_price": 158.0,
          "arrival_connections_number": "1",
          "arrival_connections_list": [
            "Leonardo da VinciFiumicino Airport"
          ],
          "departure_daytime": "2025-01-20 20:15",
          "departure_total_price": 152.0,
          "departure_connections_number": "1",
          "departure_connections_list": [
            "Zurich Airport"
          ],
          "flights_total_price": 310.0,
          "hotel_name": "La Ruinette Immobilier - Location & Vente",
          "hotel_total_price": 2230.0
        }
      }

*/