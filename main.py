import requests
import json
from serpapi import GoogleSearch
import requests

SERPAPI_KEY = 'ded3755328a61b8898f80062bb463325013e4eab8823c5dbc730c7f5cf784014'


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
    Given the start month {months[start_month]} and end month {months[end_month]}, generate a list of the top 5 destinations for a {trip_type} trip in the given time period.\n
    The list should be 5 lines long, with each line containing the name of a destination and the country it is in.
    Do not include any other information in your response.
    The format should be:
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    <destination>,<nearest_city_with_airport>,<country>
    Where <destination> is the name of the destination, <nearest_city_with_airport> is the nearest city with an airport, and <country> is the country it is in.
    """).split("\n")[:5]
    print(f"response is: {response}")
    for destination in response:
        destination_name, destination_city, destination_country = destination.split(",")  # nopep8
        final_list.append((destination_name.strip(), destination_city.strip(), destination_country.strip()))  # nopep8

    return final_list


def search_flights(destinations: list, start_date: str, end_date: str):
    for destination in destinations:

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
        flight_search_params = {
            "engine": "google_flights",
            "departure_id": "TLV",
            "arrival_id": destination_airport_code,
            "outbound_date": start_date,
            "return_date": end_date,
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY
        }
        flight_search = GoogleSearch(flight_search_params)
        # Perform the flight search and store the results
        results = flight_search.get_dict()

        # Define the filename for the JSON output
        json_filename = f"{destination_city}_{
            destination_country}_flights.json"

        # Write the results to a JSON file
        with open(json_filename, 'w') as json_file:
            json.dump(results, json_file, indent=4)

        print(f"Saved flight data for {destination_city}, {destination_country} to {json_filename}")  # nopep8


def main():
    destinations = get_top_5_destinations(1, 2, "ski")
    search_flights(destinations, "2025-01-16", "2025-02-10")


if __name__ == "__main__":
    main()
