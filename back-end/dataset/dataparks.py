import matplotlib.pyplot as plt
import pandas as pd

def plot_sports_distribution(park_name):
    df = pd.read_csv('parksdata.csv')

    park_data = df[df['Park Location'].str.lower() == park_name.lower()]

    if park_data.empty:
        print(f"No data found for the park: {park_name}")
        return

    sports_sum = park_data['Sports Played'].str.split(',').explode().str.strip().value_counts()

    plt.figure(figsize=(20, 20))
    plt.pie(sports_sum, labels=sports_sum.index, autopct='%1.1f%%', startangle=140)
    plt.title(f'Sports Distribution in {park_name}')
    plt.show()

#park_name_input = input("Enter the park name: ")
plot_sports_distribution('Sunset Park')