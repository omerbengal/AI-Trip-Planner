import { useState } from 'react';
import axios from 'axios';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Head from 'next/head';

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
  const [showDailyPlan, setShowDailyPlan] = useState(false);
  const [dailyPlanAndImagesLinks, setDailyPlanAndImagesLinks] = useState({});


  const getDestinations = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (!tripType) {
      alert('Please select a trip type');
      return;
    }

    setShowButton(false);
    setShowDestinations(true);

    setLoading(true);
    try {

      // const response = await axios.get(`http://127.0.0.1:8000/top-5-options?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&trip_type=${tripType}&budget=${budget}`);
      // setDestinations(response.data);
      const response = {
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
      setDestinations(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  const getDailyPlanAndImages = async (key) => {

    // at this point, the state "destinations" should have the selected destination as the only key in the object
    setLoading(true);
    try {
      // const response = await axios.get(`http://127.0.0.1:8000/daily-plan-and-images?arrival_date=${startDate.format('YYYY-MM-DD')}&departure_date=${endDate.format('YYYY-MM-DD')}&trip_type=${tripType}&destination=${destinations[key].destination}&country=${destinations[key].country}`);
      // setDailyPlanAndImagesLinks(response.data);
      const response = {
        "daily_plan": {
          "1": [
            "Arrive in Zermatt and check into hotel.",
            "Evening walk in the village and dinner at a local restaurant."
          ],
          "2": [
            "Breakfast at hotel.",
            "Full day skiing on Gornergrat.",
            "Lunch at a mountaintop restaurant.",
            "Dinner in Zermatt village."
          ],
          "3": [
            "Breakfast at hotel.",
            "Morning skiing on Rothorn.",
            "Lunch at a mountain hut.",
            "Spa and wellness session in the afternoon.",
            "Dinner at hotel."
          ],
          "4": [
            "Breakfast at hotel.",
            "Day trip with the Glacier Express to nearby resorts.",
            "Lunch on the train.",
            "Return to Zermatt for evening relaxation.",
            "Dinner at a Swiss fondue restaurant."
          ],
          "5": [
            "Breakfast at hotel.",
            "Full day skiing in the Matterhorn Glacier Paradise area.",
            "Lunch at the panoramic restaurant.",
            "Evening walk and photo session of the Matterhorn.",
            "Dinner at a cozy chalet restaurant."
          ],
          "6": [
            "Breakfast at hotel.",
            "Snowshoe hiking in the morning.",
            "Lunch in Zermatt village.",
            "Afternoon visit to Zermatlantis Matterhorn Museum.",
            "Dinner at a gourmet restaurant."
          ],
          "7": [
            "Breakfast at hotel.",
            "Morning tobogganing in Furi.",
            "Lunch at a mountain restaurant.",
            "Afternoon relaxation back at hotel.",
            "Dinner at an Italian restaurant."
          ],
          "8": [
            "Breakfast at hotel.",
            "Full day skiing on Sunnegga.",
            "Lunch at a mountainside café.",
            "Afternoon hot chocolate break at Theodul Glacier.",
            "Dinner at hotel."
          ],
          "9": [
            "Breakfast at hotel.",
            "Morning ice climbing session.",
            "Lunch in Zermatt village.",
            "Afternoon shopping for souvenirs.",
            "Dinner at a French bistro."
          ],
          "10": [
            "Breakfast at hotel.",
            "Leisurely walk around Zermatt for last-minute sightseeing.",
            "Lunch at a local eatery.",
            "Prepare for departure."
          ]
        },
        "images": [
          "https://wallpapercave.com/wp/wp4471360.jpg",
          "https://wallpapercave.com/wp/wp4471360.jpg",
          "https://wallpapercave.com/wp/wp4471360.jpg",
          "https://wallpapercave.com/wp/wp4471360.jpg"
        ]
      };
      setDailyPlanAndImagesLinks(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowDailyPlan(true);
    }
  };

  const handleClick = (key) => {
    console.log(key);
    setDestinations({ [key]: destinations[key] });
    getDailyPlanAndImages(key);
  };

  // Update the event handlers to show the button again when any input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setShowButton(true); // Show the button
    setShowDestinations(false);
    setShowDailyPlan(false);
  };

  // Update the onDatesChange handler to show the button again when dates change
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setShowButton(true); // Show the button
    setShowDestinations(false);
    setShowDailyPlan(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(budget, 10) <= 0 || isNaN(parseInt(budget, 10))) {
      alert('Please enter a budget greater than 0');
      return;
    }
    getDestinations();
  };


  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <div>
        <h1>AI Trip Planner</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label className="form-label">
              Trip type:
              <select className="form-input" value={tripType} onChange={handleInputChange(setTripType)} required>
                <option value="" disabled>Select trip type</option>
                <option value="ski">Ski</option>
                <option value="beach">Beach</option>
                <option value="city">City</option>
                <option value="adventure">Adventure</option>
                <option value="cruise">Cruise</option>
                <option value="camping">Camping</option>
                <option value="luxury">Luxury</option>
                <option value="culinary">Culinary</option>
              </select>
            </label>
            <label className="form-label">
              Budget:
              <input className="form-input" style={{ width: "5em" }} type="number" value={budget} onChange={handleInputChange(setBudget)} required min="1" />
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

        {loading && <p className="loading-text">Loading...</p>}
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
        {loading && <p className="loading-text">Loading...</p>}
        {showDailyPlan && (
          <div className="daily-plan-and-images-container" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className='daily-plan'>
              <h2 style={{ textAlign: 'center' }}>Daily Plan</h2>
              {Object.entries(dailyPlanAndImagesLinks.daily_plan).map(([key, value], index) => (
                <div style={{ marginTop: 20 }}>
                  <span style={{ marginBottom: 5, textDecoration: 'underline' }}>Day {key}:<br /></span>
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </div>
              ))}
            </div>
            <div className='images'>
              <h2 style={{ textAlign: 'center' }}>Images</h2>
              {dailyPlanAndImagesLinks.images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index}`} width={256} height={256} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}