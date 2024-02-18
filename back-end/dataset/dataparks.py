import os
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


def plot_sports_distribution(park_name, output_folder='graph_outputs', title_font='Montserrat'):
    df = pd.read_csv('parksdata.csv')

    park_data = df[df['Park Location'].str.lower() == park_name.lower()]

    if park_data.empty:
        print(f"No data found for the park: {park_name}")
        return

    sports_sum = park_data['Sports Played'].str.split(',').explode().str.strip().value_counts()

    top_15_sports = sports_sum.nlargest(15)

    num_wedges = len(top_15_sports)
    explode = [0.2] * num_wedges

    colors = plt.cm.tab20c(np.linspace(0, 1, num_wedges))

    plt.figure(figsize=(10, 9))
    plt.pie(top_15_sports, labels=top_15_sports.index, autopct=lambda p: '{:.1f}%'.format(p) if p > 0 else '',
            startangle=140, radius=0.8, explode=explode, colors=colors)

    plt.title(f'Top 15 Sports Distribution in {park_name}', fontsize=20, fontweight='bold', fontname=title_font)

    output_pdf = os.path.join(output_folder, f'{park_name}_sports_distribution.pdf')
    os.makedirs(output_folder, exist_ok=True)  # Create the folder if it doesn't exist
    plt.savefig(output_pdf, bbox_inches='tight')  # Save the figure as a PDF

    plt.show()


plot_sports_distribution('Thomas Jefferson Park', output_folder='graph_outputs', title_font='Georgia')
