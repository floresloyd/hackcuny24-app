import csv
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
import pandas as pd


def create_bar_graph(csv_file):
    labels = []
    values = []

    with open(csv_file, 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            labels.append(row['Geography'])
            values.append(float(row['Number'].replace(',', '')))

    # Define colors for each bar
    bar_colors = ['red']

    plt.figure(figsize=(10, 10))
    plt.bar(labels, values, color=bar_colors, width=0.5)  # Adjust the width as needed
    plt.xlabel('Borough', fontweight='bold')
    plt.ylabel('Number (in thousands)', fontweight='bold')
    plt.title(r'Obesity rates in the 5 boroughs (2020)', fontweight='bold', fontsize=15)

    plt.xticks(rotation=45, ha='right')

    def format_thousands(value, _):
        return f'{value / 1000:,.0f}K'

    plt.gca().yaxis.set_major_formatter(FuncFormatter(format_thousands))

    plt.show()


create_bar_graph('obesityrates.csv')
