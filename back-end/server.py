from flask import Flask, jsonify
from flask_cors import cross_origin
import requests

app = Flask(__name__)


@app.route("/get-nyc-events")
@cross_origin(origin="*")
def get_nyc_events():
    try:
        url = "https://api.nyc.gov/calendar/search?startDate=01%2F01%2F2024%2012:00%20AM&endDate=01%2F07%2F2025%2012:00%20AM&categories=athletic&sort=DATE"

        headers = {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': '2ddd946447ea4688baea5faae4275195',
        }

        response = requests.get(url, headers=headers, verify=True)
        
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            data = response.json()  # Convert response to JSON
            return jsonify(data)
        else:
            # If request was not successful, return error message
            return jsonify({"error": f"Request failed with status code {response.status_code}"})

    except Exception as e:
        # Handle any exceptions that may occur during the request
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True, port=8080)
    

