import os
from flask import Flask, redirect, request
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

app = Flask(__name__)

# Google Fit API scopes
SCOPES = ['https://www.googleapis.com/auth/fitness.activity.read']

# The file token.json stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
TOKEN_FILE = 'token.json'

# Your Google Fit API credentials (download from the Google Cloud Console)
CLIENT_ID = '637782975451-uv5423ht1qe3bolhbadqpnorcre90dkn.apps.googleusercontent.com'
CLIENT_SECRET = 'yGOCSPX-InTVTmR-LnijMAf5VTnjd0pLJ5SN'
REDIRECT_URI = 'https://127.0.0.1:8080/callback'

@app.route('/')
def index():
    # Start the OAuth 2.0 authorization flow
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json',
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        prompt='select_account'
    )

    return redirect(authorization_url)

@app.route('/callback')
def auth_callback():
    print("Request URL:", request.url)
    # Retrieve the authorization response from the callback
    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json',
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    flow.fetch_token(authorization_response=request.url)

    # Print relevant information for debugging
    print("Authorization Code:", flow.authorization_response)
    print("Access Token:", flow.credentials.token)
    print("Refresh Token:", flow.credentials.refresh_token)
    print("Expires in:", flow.credentials.expires_in)

    # Save the credentials to a file
    if not os.path.exists('token.json'):
        os.makedirs('token.json')
    flow.save_to_disk(TOKEN_FILE)

    return 'Authentication successful! You can now access Google Fit data.'


def get_fit_data():
    # Load the stored credentials
    credentials = None
    if os.path.exists(TOKEN_FILE):
        credentials = Credentials.from_authorized_user_file(TOKEN_FILE)

    # If credentials are not available or are expired, refresh them
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            return redirect('/')

    fit_service = build('fitness', 'v1', credentials=credentials)

    # Fetch daily step count data
    data_source = 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
    start_time = '2022-02-01T00:00:00.000Z'  # Replace with your desired start time
    end_time = '2022-03-01T00:00:00.000Z'    # Replace with your desired end time

    response = fit_service.users().dataSources().datasets(). \
        get(userId='me', dataSourceId=data_source, datasetId=f'{start_time}-{end_time}').execute()

    step_count = response.get('point', [])[0].get('value', [])[0].get('intVal', 0)

    return f'Daily Step Count: {step_count}'

@app.route('/get_fit_data')
def fetch_fit_data():
    return get_fit_data()

if __name__ == '__main__':
    app.run(port=8080)
