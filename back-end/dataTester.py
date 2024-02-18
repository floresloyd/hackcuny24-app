import json
import matplotlib.pyplot as plt

# Load data from the JSON file
with open('dataUser.json', 'r') as file:
    data = json.load(file)

# Extract activity types and corresponding durations
activities = data['userActivities']['activities']
activity_types = [activity['activityType'] for activity in activities]
durations = [activity['durationMinutes'] for activity in activities]

# Create a pie chart
plt.figure(figsize=(8, 8))
plt.pie(durations, labels=activity_types, autopct='%1.1f%%', startangle=90)
plt.title('Activity Distribution')
plt.show()
