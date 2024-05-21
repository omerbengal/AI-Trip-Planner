import json
from serpapi import GoogleSearch
from openai import OpenAI
import unicodedata

SERPAPI_KEY = '32383635dd8a34f9ec6dc20c43f2962bbf9bfb347154d4a72a13e55d988e3ed8'
OPENAI_CLIENT = OpenAI(api_key="sk-proj-5hGNQsFq3ncGG0V3vcOeT3BlbkFJej39qWF8lI2qLnJqTOjt")  # nopep8


def upload_file_to_open_ai(file_path: str) -> str:
    response = OPENAI_CLIENT.files.create(file=open(file_path, 'rb'), purpose='assistants')  # nopep8
    return response.id


def send_prompt(prompt) -> str:
    completion = OPENAI_CLIENT.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an experienced worldwide vacation planner. Additionally you are familiar with airports around the world."},
            {"role": "user", "content": prompt}
        ]
    )
    response = completion.choices[0].message.content
    if response is None:
        return ''
    else:
        return response


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

    prompt = f"""
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
    Try to suggest nearest city with an airport that are well-known and have international airports.
    """

    file_id = upload_file_to_open_ai('airports-code.json')

    if file_id:
        prompt += f"""\n\nHere is the file id for airports code of cities around the world: {file_id}
        Use this file as a reference to find the correct name of a nearest city with an airport for each destination.
        Also - use this file as a reference to find the correct name of the country for each destination.
        """

    response = send_prompt(prompt).split("\n")[:10]
    for destination in response:
        destination_name, destination_city, destination_country = destination.split(",")  # nopep8
        final_list.append((destination_name.strip(), destination_city.strip(), destination_country.strip()))  # nopep8

    return final_list


def get_daily_plan_for_destination(arrival_date_and_time: str, departure_date_and_time: str, trip_type: str, location: str) -> str:
    old_prompt = f"""
    Given the arrival date and time {arrival_date_and_time}, departure date and time {departure_date_and_time}, trip type {trip_type}, and location {location}, generate a daily plan for a {trip_type} vacation in the given location.\n
    Do not include any other information in your response.
    The format should be:
    Day 1:
    <activity>
    <activity>
    ...
    Day 2:
    <activity>
    <activity>
    ...
    Day 3:
    <activity>
    <activity>
    ...
    Day N:
    <activity>
    <activity>
    ...
    4 Best Moments:
    <moment>
    <moment>
    <moment>
    <moment>
    Where <activity> is an activity that can be done in the location or nearby, and N is the number of days in the trip.
    Do not include more than 3 activities per day.
    Make sure to include a variety of activities that cater to different interests and preferences.
    The activities in each day should be with consideration to the time it takes to do them, and so there could be days with less than 3 acivities.
    If the arrival date and time is in the evening, the first day should include activities that can be done in the evening, and the same applies to the departure date and time.
    In addition, each <moment> is a chosen activity (out of the activities you provided) which represents the best and beautiful moments of the trip.
    """

    updated_prompt = f"""
    I am going on a solo {trip_type} vacation to {location}. My arrival date and time: {arrival_date_and_time}, my departure date and time: {departure_date_and_time}.
    I need you to generate a daily plan for this {trip_type} vacation in the given time and location.
    Do not include any other information in your response.
    The format should be:
    Day 1:
    <activity>
    <activity>
    ...
    Day 2:
    <activity>
    <activity>
    ...
    Day 3:
    <activity>
    <activity>
    ...
    Day N:
    <activity>
    <activity>
    ...
    4 Best Moments:
    <moment>
    <moment>
    <moment>
    <moment>

    Here are some guidance:
    Each <activity> is an activity that can be done in the location or nearby at the specified time of year.
    I put 2 activity tags in each day, but you can put less or more depending on the time it takes to do them.
    N is the number of days in the trip.
    The 4 <moment> tags represents the 4 most thrilling, exciting, beautiful and fun activities (out of the activities you provided) which represents the best potential moments of the vacation.

    Some considerations:
    Take into consideration the time of the day when the arrival and departure are.
    Make sure to include a variety of activities that cater to different interests and preferences.
    Also notice that like any other human - I need to eat, and sleep. So make sure to include some relaxing activities and time to eat (breakfast, lunch and dinner) and sleep.
    """

    response = send_prompt(updated_prompt)
    return response


def find_airport_code(city: str, country: str) -> str:
    with open('airports-code.json', 'r') as file:
        airport_codes = json.load(file)
    destination_airport_code = None
    fixed_city = unicodedata.normalize('NFKD', city).encode(
        'ascii', 'ignore').decode('utf-8')
    fixed_country = unicodedata.normalize(
        'NFKD', country).encode('ascii', 'ignore').decode('utf-8')
    for airport in airport_codes:
        if (fixed_city.lower().strip() in airport['city_name'].lower().strip()
                or airport['city_name'].lower().strip() in fixed_city.lower().strip()
                or fixed_city.lower().strip() in airport['airport_name'].lower().strip()) and \
                (fixed_country.lower().strip() in airport['country_name'].lower().strip() or airport['country_name'].lower().strip() in fixed_country.lower().strip() or fixed_country.lower().strip() in airport['country_code'].lower().strip() or airport['country_code'].lower().strip() in fixed_country.lower().strip()):
            destination_airport_code = airport['column_1']
            break
    if destination_airport_code:
        return destination_airport_code
    else:
        return ''


def search_flights(destinations: list, start_date: str, end_date: str, budget: int) -> dict:
    flights = {}
    for destination in destinations:

        destination_city = destination[1]
        destination_country = destination[2]
        destination_airport_code = None
        destination_airport_code = find_airport_code(
            destination_city, destination_country)
        if destination_airport_code == '':
            print(f"Could not find airport code for {destination_city}, {destination_country}")  # nopep8
            continue
        from_TLV_flight_search_params = {
            "engine": "google_flights",
            "departure_id": "TLV",
            "arrival_id": destination_airport_code,
            "outbound_date": start_date,
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY,
            "type": "2"
        }
        flight_search = GoogleSearch(from_TLV_flight_search_params)
        # Perform the flight search and store the results
        results = flight_search.get_dict()

        # Check if there was an error with the flight search
        if 'error' in results.keys():
            print(
                f"Error from serpapi: from TLV to {destination[0]} {destination[1]} {destination[2]}")
            continue
        elif 'best_flights' in results.keys():
            from_TLV_cheapest_flight = results['best_flights'][0]

        # else
        else:
            from_TLV_cheapest_flight = results['other_flights'][0]

        to_TLV_flight_search_params = {
            "engine": "google_flights",
            "departure_id": destination_airport_code,
            "arrival_id": "TLV",
            "outbound_date": end_date,
            "currency": "USD",
            "hl": "en",
            "api_key": SERPAPI_KEY,
            "type": "2",
        }
        flight_search = GoogleSearch(to_TLV_flight_search_params)
        # Perform the flight search and store the results
        results = flight_search.get_dict()

        # Check if there was an error with the flight search
        if 'error' in results.keys():
            print(
                f"Error from serpapi: from {destination[0]} {destination[1]} {destination[2]} to TLV")
            continue

        elif 'best_flights' in results.keys():
            to_TLV_cheapest_flight = results['best_flights'][0]

        # else
        else:
            to_TLV_cheapest_flight = results['other_flights'][0]

        # check if sum of the two flights prices is within budget
        total_flights_price = from_TLV_cheapest_flight['price'] + to_TLV_cheapest_flight['price']  # nopep8
        if total_flights_price > budget:  # nopep8
            print(
                f"Total price of flights to {destination_city}, {destination_country} and back is above budget")
            continue

        flights['@'.join((destination[0], destination[1], destination[2]))] = [[from_TLV_cheapest_flight, to_TLV_cheapest_flight], budget - total_flights_price]  # nopep8

    return flights


def search_hotels(destinations: dict, start_date: str, end_date: str) -> dict:
    hotels = {}
    for key, destination in destinations.items():
        destination_name = key.split('@')[0]
        destination_country = key.split('@')[2]
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
            hotels[key] = None
        else:
            hotels[key] = [results['properties'], destination[1]]  # nopep8
    return hotels


def get_most_expensive_hotels(hotels: dict) -> dict:
    max_hotel = {}
    for key, hotels_and_leftover_budget in hotels.items():
        max_price = 0
        if hotels_and_leftover_budget is None:
            continue
        for hotel in hotels_and_leftover_budget[0]:
            if 'total_rate' not in hotel.keys():
                continue
            hotel_price = hotel['total_rate']['extracted_lowest']
            if hotel_price > max_price and hotels_and_leftover_budget[1] >= hotel_price:  # nopep8
                max_price = hotel_price
                max_hotel[key] = hotel

    return max_hotel


def get_dalle_images(activity: str, country: str, gender: str) -> str:
    prompt = f"""I am a {gender} who is going to a solo vacation to {country}, and I am going to do the following activity: {activity}.
    I could use your image generating skills to help me understand and feel the amazing moment I am going to have.
    Please generate an image of the activity. Make sure it looks real - don't exaggerate...
    Also - the image should not focus on me, only focus on the activity and maybe people that are needed for the activity (such as a show performers or an instructor, etc)."""

    response = OPENAI_CLIENT.images.generate(
        model="dall-e-2",
        prompt=prompt,
        size="512x512",
        quality="standard",
        n=1,
    )

    url = response.data[0].url
    if url:
        return url
    else:
        return ''


def main():
    start_month = 9
    end_month = 9
    trip_type = "ski"
    destinations = get_top_5_destinations(start_month, end_month, trip_type)
    print(destinations)
    start_date = "2024-09-01"
    end_date = "2024-09-15"
    budget = 30000
    flights = search_flights(destinations, start_date, end_date, budget)
    hotels = search_hotels(flights, start_date, end_date)
    most_expensive_hotels = get_most_expensive_hotels(hotels)
    for key, value in most_expensive_hotels.items():
        print(f"Destination: {key}")
    chosen_dest = input("Enter the destination you would like to get a daily plan for: ")  # nopep8
    gender = input("Male/Female? ")
    arrival_date = flights[chosen_dest][0][0]['flights'][len(flights[chosen_dest][0][0]['flights']) - 1]['arrival_airport']['time']  # nopep8
    print(arrival_date)
    departure_date = flights[chosen_dest][0][1]['flights'][0]['departure_airport']['time']  # nopep8
    print(departure_date)
    daily_plan = get_daily_plan_for_destination(arrival_date, departure_date, trip_type, f"{chosen_dest.split('@')[0]} , {chosen_dest.split('@')[2]}")  # nopep8
    print(daily_plan)
    activities = daily_plan.splitlines()[-4:]
    for activity in activities:
        image_url = get_dalle_images(activity, chosen_dest.split('@')[2], gender)  # nopep8
        print(image_url)


if __name__ == "__main__":
    main()
