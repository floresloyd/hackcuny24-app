from flask import Flask, jsonify, redirect, request, session
from flask_cors import cross_origin
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import google.oauth2.credentials
from datetime import datetime, timedelta
import requests
import os

load_dotenv()

https_key = os.getenv('KEY_PEM_PATH')

app = Flask(__name__)
app.secret_key = https_key

# PEM environment variables
server_pem = os.getenv("SERVER_PEM_PATH")
key_pem = os.getenv("KEY_PEM_PATH")

# NYC API environment variables
nyc_api_key = os.getenv("NYC_API_KEY")

# Google API environment variables
google_client_id = os.getenv("GOOGLE_CLIENT_ID")
google_project_id = os.getenv("GOOGLE_PROJECT_ID")
google_auth_uri = os.getenv("GOOGLE_AUTH_URI")
google_auth_provider_cert_url = os.getenv("GOOGLE_AUTH_PROVIDER_CERT_URL")
google_token_uri = os.getenv("GOOGLE_TOKEN_URI")
google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
#      JS origins is a list, handle for list return type
google_js_origins = os.getenv("GOOGLE_JS_ORIGINS")
google_js_origins_list = google_js_origins.split(',') if google_js_origins else []
#      redirect uris is a list, handle for list return type
google_redirect_uris = os.getenv("GOOGLE_REDIRECT_URIS", "")
google_redirect_uris_list = google_redirect_uris.split(',') if google_redirect_uris else []
#      scopes is a list, handle for list return type
google_scopes = os.getenv("GOOGLE_SCOPES", "")
google_scopes_list = google_scopes.split(',') if google_scopes else []

# Credentials for Google API call, loaded in from .env variables for secure, data-protected push to GitHub
credentials_json = {
    "web": {
        "client_id": google_client_id,
        "project_id": google_project_id,
        "auth_uri": google_auth_uri,
        "token_uri": google_token_uri,
        "auth_provider_x509_cert_url": google_auth_provider_cert_url,
        "client_secret": google_client_secret,
        "redirect_uris": google_redirect_uris_list,
        "javascript_origins": google_js_origins_list
    }
}

# Converts my 'hidden' credentials to a dictionary so I can refresh credentials when needed
def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}

# Setup OAuth 2.0 Authorization flow
flow = Flow.from_client_config(
    client_config=credentials_json,
    scopes=google_scopes_list,
    redirect_uri=google_redirect_uris_list[0])

# Serve NYC Events data
@app.route("/get-nyc-events")
@cross_origin(origin="*")
def get_nyc_events():
    try:
        url = "https://api.nyc.gov/calendar/search?startDate=01%2F01%2F2024%2012:00%20AM&endDate=01%2F07%2F2025%2012:00%20AM&categories=athletic&sort=DATE"
        headers = {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': nyc_api_key,
        }
        response = requests.get(url, headers=headers, verify=True)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": f"Request failed with status code {response.status_code}"})
    except Exception as e:
        return jsonify({"error": str(e)})

# Redirect User for Google OAuth
@app.route('/login')
def login():
    authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
    session['state'] = state
    return redirect(authorization_url)

# Redirect's if OAuth successful, with token
@app.route('/callback')
def callback():
    state = session['state']
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)
    return redirect('/get-heart-rate-data')

# Returns all possible data sources associated with this user
@app.route('/get-all-data-sources')
def get_all_data_sources():
    # Ensure the user is authenticated and credentials are available
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401

    credentials = google.oauth2.credentials.Credentials(**session['credentials'])

    # Build the fitness service using the credentials
    service = build('fitness', 'v1', credentials=credentials)
    data_sources_result = service.users().dataSources().list(userId='me').execute()
    return jsonify(data_sources_result)


# Returns heart-rate data from DATA SOURCE: derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments
@app.route('/get-heart-rate-data')
def get_heart_rate_data():
    # Ensure the user is authenticated and credentials are available
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401

    credentials = google.oauth2.credentials.Credentials(**session['credentials'])

    # Define the time range for the data request
    now = datetime.utcnow()
    past = now - timedelta(days=30)  # For the last 30 days
    now_millis = int(now.timestamp()) * 1000
    past_millis = int(past.timestamp()) * 1000

    # Specify the data source and dataset for heart rate
    data_source = "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments"
    dataset = f"{past_millis}-{now_millis}"

    # Make the API request to get heart rate data
    try:
        result = service.users().dataSources().datasets().get(
            userId='me',
            dataSourceId=data_source,
            datasetId=dataset).execute()

        # Process the result to extract heart rate data
        heart_rates = []
        if "point" in result:
            for point in result["point"]:
                for value in point["value"]:
                    # Each 'point' may contain multiple readings; extract them
                    heart_rates.append({
                        "timestamp": point.get("startTimeNanos"),
                        "heart_rate_bpm": value.get("fpVal")  # Using fpVal for floating-point values
                    })

        # Return the heart rate data
        return jsonify(heart_rates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080, ssl_context=(server_pem, key_pem))
