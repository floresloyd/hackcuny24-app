import os
import csv
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

def create_bar_graph(csv_file, output_folder='graph_outputs'):
    labels = []
    values = []

    with open(csv_file, 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            labels.append(row['Geography'])
            values.append(float(row['Number'].replace(',', '')))

    colormap = plt.cm.viridis
    bar_colors = [colormap(i / len(labels)) for i in range(len(labels))]

    plt.figure(figsize=(8, 10))
    plt.bar(labels, values, color=bar_colors, width=0.3)  # Adjust the width as needed
    plt.xlabel('Borough', fontweight='bold', fontsize=13)
    plt.ylabel('Number (in thousands)', fontweight='bold', fontsize=13)
    plt.title(r'Obesity rates in the 5 boroughs', fontweight='bold', fontsize=20, fontname='Georgia')

    plt.xticks(range(len(labels)), labels, rotation=45, ha='right')

    def format_thousands(value, _):
        return f'{value / 1000:,.0f}K'

    plt.gca().yaxis.set_major_formatter(FuncFormatter(format_thousands))

    output_pdf = os.path.join(output_folder, 'obesity_rates_plot.pdf')
    os.makedirs(output_folder, exist_ok=True)  # Create the folder if it doesn't exist
    plt.savefig(output_pdf, bbox_inches='tight')  # Save the figure as a PDF

    plt.show()

create_bar_graph('obesityrates.csv', 'graph_outputs')
