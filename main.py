from datetime import datetime
import requests
import json
from serpapi import GoogleSearch
import requests

SERPAPI_KEY = 'c76e561255457269b252f96015c08787cc3344c26115373841fbe69295c684e5'


def send_prompt(prompt):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        # Replace YOUR_API_KEY with your actual OpenAI API key
        "Authorization": "Bearer sk-proj-5hGNQsFq3ncGG0V3vcOeT3BlbkFJej39qWF8lI2qLnJqTOjt"
    }
    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()  # Raise an exception for HTTP errors
        response_data = response.json()
        return response_data['choices'][0]['message']['content']
    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err}"
    except Exception as err:
        return f"An error occurred: {err}"


def get_top_5_destinations(start_month: int, end_month: int, trip_type: str):

    final_list = []
    months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    response = send_prompt(f"""
    Given the start month {months[start_month]} and end month {months[end_month]}, generate a list of the top 10 destinations for a {trip_type} vacation in the given time of the year.\n
    Do not include any other information in your response.
    The format should be:
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    Where <destination> is the name of the destination, <nearest_city_with_airport> is the nearest city with an airport, and <country> is the country of the destination.
    Make sure to exclude any commas in the destination or nearest_city_with_airport or country names.
    """).split("\n")[:10]
    for destination in response:
        destination_name, destination_city, destination_country = destination.split(",")  # nopep8
        final_list.append((destination_name.strip(), destination_city.strip(), destination_country.strip()))  # nopep8

    return final_list


def search_flights(destinations: list, start_date: str, end_date: str):
    valid_flights_counter = 0
    for destination in destinations:
        if valid_flights_counter == 5:
            break

        with open('airports-code.json', 'r') as file:
            airport_codes = json.load(file)

        destination_city = destination[1]
        destination_country = destination[2]
        destination_airport_code = None
        for airport in airport_codes:
            if airport['city_name'].lower() == destination_city.lower():
                destination_airport_code = airport['column_1']
                break
        if not destination_airport_code:
            print(f"Could not find airport code for {destination_city}, {destination_country}")  # nopep8
            continue
        from_TLV_flight_search_params = {
            "engine": "google_flights",
            "departure_id": "TLV",
            "arrival_id": destination_airport_code,
            "outbound_date": start_date,
            # "return_date": end_date,
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY,
            "type": "2"
        }
        flight_search = GoogleSearch(from_TLV_flight_search_params)
        # Perform the flight search and store the results
        results = flight_search.get_dict()

        # save the results to a json file
        with open('from_TLV_flight_search_results.json', 'w') as file:
            json.dump(results, file, indent=4)

        # Check if there was an error with the flight search
        if 'error' in results.keys():
            print(f"Error: {results['error']} from TLV")
            continue
        # else:
        from_TLV_cheapest_flight = results['best_flights'][0]

        to_TLV_flight_search_params = {
            "engine": "google_flights",
            "departure_id": destination_airport_code,
            "arrival_id": "TLV",
            "outbound_date": end_date,
            # "return_date": end_date,
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY,
            "type": "2",
            # "departure_token": from_TLV_cheapest_flight['departure_token']
        }
        flight_search = GoogleSearch(to_TLV_flight_search_params)
        # Perform the flight search and store the results
        results = flight_search.get_dict()

        # save the results to a json file
        with open('to_TLV_flight_search_results.json', 'w') as file:
            json.dump(results, file, indent=4)

        # Check if there was an error with the flight search
        if 'error' in results.keys():
            print(f"Error: {results['error']} to TLV")
            continue
        # else:
        to_TLV_cheapest_flight = results['best_flights'][0]

        # Define the filename for the JSON output
        json1_filename = f"From TLV to {destination_city}_{destination_country}_flight.json"  # nopep8

        # Define the filename for the JSON output
        json2_filename = f"From {destination_city}_{destination_country} to TLV_flight.json"  # nopep8

        # Write the results to a JSON file
        with open(json1_filename, 'w') as json_file:
            json.dump(from_TLV_cheapest_flight, json_file, indent=4)
        print(f"Saved flight data for {destination_city}, {destination_country} to {json1_filename}")  # nopep8

        # Write the results to a JSON file
        with open(json2_filename, 'w') as json_file:
            json.dump(to_TLV_cheapest_flight, json_file, indent=4)
        print(f"Saved flight data for {destination_city}, {destination_country} to {json2_filename}")  # nopep8

        # Increment the counter of valid flights
        valid_flights_counter += 1


def search_hotels(destinations: dict, start_date: str, end_date: str) -> dict:
    hotels = {}
    for key, destination in destinations.items():
        destination_name = key[0]
        destination_country = key[2]
        hotel_search_params = {
            "engine": "google_hotels",
            "q": f"{destination_name}, {destination_country}",
            "check_in_date": start_date,
            "check_out_date": end_date,
            "adults": "1",
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY
        }

        hotel_search = GoogleSearch(hotel_search_params)
        results = hotel_search.get_dict()
        if 'error' in results.keys():
            hotels[(key[0], key[1], key[2])] = None
        else:
            with open(f"{key[0]}_{key[1]}_{key[2]}_hotels.json", 'w') as file:
                json.dump(results, file, indent=4)
            hotels[(key[0], key[1], key[2])] = [results['properties'], destination[1]]  # nopep8
    return hotels


def get_most_expensive_hotel(hotels: dict):
    max_price = 0
    max_hotel = None
    for key, hotel_and_leftover_budget in hotels.items():
        if 'total_rate' not in hotel_and_leftover_budget[0].keys():
            continue
        hotel_price = hotel_and_leftover_budget[0]['total_rate']['extracted_lowest']
        if hotel_price <= hotel_and_leftover_budget[1] and hotel_price > max_price:
            max_price = hotel_price
            max_hotel = hotel_and_leftover_budget[0]

    if max_hotel is None:
        return None

    return max_hotel


def main():
    pass


if __name__ == "__main__":
    main()
