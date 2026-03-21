import requests

try:
    # 1. Send the GET request
    response = requests.get('http://localhost:3000/data')

    # 2. Check if the request was successful (Status Code 200)
    response.raise_for_status()

    # 3. Parse the JSON data directly into a Python dictionary
    data = response.json()

    # 4. Access your data
    print(f"Message: {data['message']}")
    print(f"Value: {data['value']}")

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")