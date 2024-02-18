from flask import Flask, jsonify, redirect, request, session
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import google.oauth2.credentials
from datetime import datetime, timedelta
import requests
import os
import openai

load_dotenv()

https_key = os.getenv("KEY_PEM_PATH")
openai.api_key=os.getenv("OPENAI_API_KEY")

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

# OPENAI environment variable
api_key = os.getenv("OPENAI_API_KEY")

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
@cross_origin(origin="*")
def login():
    authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
    session['state'] = state
    return redirect(authorization_url)

# Redirect's if OAuth successful, with token
@app.route('/callback')
@cross_origin(origin="*")
def callback():
    state = session['state']
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)
    session['access_token'] = credentials.token
    print(f"ACCESS_TOKEN inside callback page = {session['access_token']}")
    return redirect('/get-all-data-sources')

# Returns all possible data sources associated with this user
@app.route('/get-all-data-sources')
@cross_origin(origin="*")
def get_all_data_sources():
    # Ensure the user is authenticated and credentials are available
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401
    
    access_token = session.get('access_token', 'No access token found')
    print(f"ACCESS_TOKEN inside get-all-data-source page = {access_token}")

    credentials = google.oauth2.credentials.Credentials(**session['credentials'])

    # Build the fitness service using the credentials
    service = build('fitness', 'v1', credentials=credentials)
    data_sources_result = service.users().dataSources().list(userId='me').execute()

    # Scan through data_sources_result and print 'steps'
    for data_source in data_sources_result.get('dataSource', []):
        data_type = data_source.get('dataType', {}).get('name', '')
        if data_type == 'com.google.step_count.delta':
            print(f"Data Source ID: {data_source.get('dataStreamId')}")
            print(f"Data Source Name: {data_source.get('dataStreamName')}")
            print("Steps:")

            # Extracting steps data
            for field in data_source.get('dataType', {}).get('field', []):
                if field.get('name') == 'steps':
                    steps_data = data_source.get('dataStreamId')
                    print(steps_data)
                    break

    return jsonify(data_sources_result)

# HEART-RATE ---> DATA SOURCE: derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments
# NEED TO FINISH
@app.route('/get-heart-rate-data')
@cross_origin(origin="*")
def get_heart_rate_data():
    # Ensure the user is authenticated and credentials are available
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401
    
    access_token = session.get('access_token', 'No access token found')
    print(f"ACCESS_TOKEN inside get-heart-rate-data page = {access_token}")

    credentials = google.oauth2.credentials.Credentials(**session['credentials'])

    # Define the time range for the data request
    now = datetime.utcnow()
    past = now - timedelta(days=30)  # For the last 30 days
    now_millis = int(now.timestamp()) * 1000
    past_millis = int(past.timestamp()) * 1000

    # Specify the data source and dataset for heart rate
    service = build('fitness', 'v1', credentials=credentials)
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
        if len(heart_rates ) == 0:
            return 'There is no data stored for this type'
        return jsonify(heart_rates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    


# STEP-COUNT ---> REACT CLIENT
@app.route('/get-step-count-data')
@cross_origin(origin="*")
def get_step_count_data():
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401
    
    # Retrieve credentials from session
    credentials_dict = session['credentials']
    credentials = google.oauth2.credentials.Credentials(**credentials_dict)

    # Use the access token from the credentials
    access_token = credentials.token

    now = datetime.utcnow()
    past = now - timedelta(days=30)  # Adjust as needed
    now_millis = int(now.timestamp()) * 1000
    past_millis = int(past.timestamp()) * 1000

    # Call the function to fetch step count data
    result = fetch_step_count_data(access_token, past_millis, now_millis)

    # Check if there's an error in the result
    if "error" in result:
        return jsonify(result), 500  # or adjust the status code based on the error

    # If there's no error, return the step count data
    return jsonify(result)


# SLEEP-DATA ---> REACT CLIENT
@app.route('/get-sleep-data')
@cross_origin(origin="*")
def get_sleep_data():
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401
    
    # Retrieve credentials from session
    credentials_dict = session['credentials']
    credentials = google.oauth2.credentials.Credentials(**credentials_dict)

    # Use the access token from the credentials
    access_token = credentials.token

    # Set the time range for the last 30 days
    now = datetime.utcnow()
    past = now - timedelta(days=30)  # Adjust as needed for sleep data
    now_millis = int(now.timestamp()) * 1000
    past_millis = int(past.timestamp()) * 1000

    # Call the function to fetch sleep data
    try:
        sleep_data = fetch_sleep_data(access_token, past_millis, now_millis)
        return jsonify(sleep_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# HEIGHT-DATA ---> REACT CLIENT
@app.route('/get-height-data')
@cross_origin(origin="*")
def get_height_data():
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401

    # Retrieve credentials from session
    credentials_dict = session['credentials']
    credentials = google.oauth2.credentials.Credentials(**credentials_dict)

    # Use the access token from the credentials
    access_token = credentials.token

    # Since height data doesn't change frequently and doesn't require a specific time range
    try:
        height_data = fetch_height_data(access_token)
        return jsonify(height_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/fitness-report')
@cross_origin(origin="*")
def fitness_report():
    if 'credentials' not in session:
        return jsonify({"error": "User is not authenticated"}), 401

    # Retrieve credentials from session
    credentials_dict = session['credentials']
    credentials = google.oauth2.credentials.Credentials(**credentials_dict)
    access_token = credentials.token

    now = datetime.utcnow()
    past = now - timedelta(days=30)  # Adjust as needed for the data timeframe
    now_millis = int(now.timestamp()) * 1000
    past_millis = int(past.timestamp()) * 1000

    # Fetch step count data using your existing function
    fit_data = fetch_step_count_data(access_token, past_millis, now_millis)
    fitness_report = generate_fitness_report(fit_data)
    print(fitness_report)
    return fitness_report




'''
'''
'''
'''
'''

FUNCTIONS BELOW

'''
'''
'''


# GET STEP-COUNT FUNCTION
def fetch_step_count_data(access_token, start_time_millis, end_time_millis):
    url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": { "durationMillis": 604800000 },
        "startTimeMillis": start_time_millis,
        "endTimeMillis": end_time_millis
    }

    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()  # Successfully fetched the data
    else:
        return {"error": f"Failed to fetch data, status code: {response.status_code}", "details": response.text}
    

# GET SLEEP-QUALITY FUNCTION
def fetch_sleep_data(access_token, start_time_millis, end_time_millis):
    url = f'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "aggregateBy": [{"dataTypeName": "com.google.sleep.segment"}],
        "endTimeMillis": end_time_millis,
        "startTimeMillis": start_time_millis
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()  # Successfully fetched the data
    else:
        return {"error": f"Failed to fetch data, status code: {response.status_code}", "details": response.text}


# GET HEIGHT-DATA FUNCTION
def fetch_height_data(access_token):
    url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "aggregateBy": [{
            "dataTypeName": "com.google.height",
            # Note: For static data like height, dataSourceId is not necessary
        }],
        # Since height is typically static, we're not specifying bucketByTime or exact times here
        # Instead, you might want to specify a broad range to ensure you capture the latest recorded height
        "startTimeMillis": "0",  # Start from the earliest possible time
        "endTimeMillis": str(int(datetime.now().timestamp()) * 1000)  # Until now
    }

    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()  # Successfully fetched the data
    else:
        return {"error": f"Failed to fetch data, status code: {response.status_code}", "details": response.text}


# GET OPENAI FITNESS FORM FUNCTION
def generate_fitness_report(fit_data):
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant asked to generate a fitness report based on the user's step count over the last 7 days. Keep in mind, the startTimeMillis and endTimeMillis represent timestamps for duration"},
            {"role": "user", "content": f"Here is my step count data over the last 7 days: {fit_data}. Can you make a fitness report, be concise and direct? Do not add up all the steps in one day"},
        ]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Make sure to use a model that supports chat, like "gpt-3.5-turbo"
            messages=messages,
            temperature=0.7,
            max_tokens=4000,
            top_p=1.0,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        # Extracting the chat model's response
        if response['choices'] and response['choices'][0]['message']['content']:
            generated_text = response['choices'][0]['message']['content'].strip()
            return jsonify({"fitness_report": generated_text})
        else:
            return jsonify({"error": "Failed to generate a summary: No response from the model."})
    except Exception as e:
        return jsonify({"error": f"Failed to generate summary: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True, port=8080, ssl_context=(server_pem, key_pem))
