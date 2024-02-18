import json

# Assuming 'data' field is present in each data source
# Adjust the path accordingly if the actual data is nested differently
data_path = ['data']

# Read JSON data from file
with open('googleUserData.json', 'r') as file:
    json_data = json.load(file)

def find_steps_data(data_source, target_name):
    if "dataType" in data_source and "field" in data_source["dataType"]:
        for field in data_source["dataType"]["field"]:
            if field.get("name") == target_name and field.get("format") == "integer":
                return data_source.get("dataStreamId"), data_source.get("dataStreamName"), field.get("name")

    return None, None, None

def extract_steps_data(data_source, target_name):
    data_stream_id, data_stream_name, field_name = find_steps_data(data_source, target_name)
    if data_stream_id and data_stream_name and field_name:
        # Extract steps data
        steps_data = data_source
        for path in data_path:
            steps_data = steps_data.get(path, {})
        return data_stream_id, data_stream_name, field_name, steps_data

    return None, None, None, None

if __name__ == "__main__":
    target_name = "estimated_steps"  # Change this to the desired name

    for data_source in json_data["dataSource"]:
        data_stream_id, data_stream_name, field_name, steps_data = extract_steps_data(data_source, target_name)

        if data_stream_id and data_stream_name and field_name and steps_data:
            print(f"Data Stream ID: {data_stream_id}")
            print(f"Data Stream Name: {data_stream_name}")
            print(f"Field Name: {field_name}")
            print(f"{target_name} Data: {steps_data}")
        else:
            print(f"{target_name} data not found in the provided JSON.")
