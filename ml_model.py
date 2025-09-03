import sys
import json

# Node.js backend se JSON string receive karein
try:
    # Attempt to read data from command-line arguments
    data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError) as e:
    # If no valid data is provided, print an error and exit
    print(json.dumps({'error': f'Invalid input data: {e}'}))
    sys.exit(1)

try:
    # Input data ko variables mein store karein
    nitrogen = data.get('nitrogen')
    potassium = data.get('potassium')
    phosphorus = data.get('phosphorus')
    humidity = data.get('humidity')
    rainfall = data.get('rainfall')
    location = data.get('location')

    # --- Yahan aapka Machine Learning Model ka logic aayega ---
    # Abhi hum ek simple example ke liye if/else logic ka istemal karenge.
    # Shubham (ML team member) is code ko asli model se replace kar dega.

    recommended_crop = "Wheat"
    recommended_fertilizer = "DAP"
    confidence_score = "High"

    # Ek simple recommendation logic ka udharan:
    if nitrogen is not None and nitrogen > 100 and phosphorus is not None and phosphorus > 50:
        recommended_crop = "Rice"
        recommended_fertilizer = "Urea"
        confidence_score = "High"
    elif potassium is not None and potassium > 40 and rainfall is not None and rainfall > 150:
        recommended_crop = "Maize"
        recommended_fertilizer = "NPK"
        confidence_score = "Medium"
    else:
        recommended_crop = "Sugarcane"
        recommended_fertilizer = "Potash"
        confidence_score = "Low"

    # Output ko JSON format mein taiyar karein
    output = {
        "crop": recommended_crop,
        "fertilizer": recommended_fertilizer,
        "confidence_score": confidence_score
    }

    # Output ko Node.js backend ko wapas bhejne ke liye print karein
    print(json.dumps(output))

except Exception as e:
    # Agar koi aur galti ho, to usko bhi capture karein
    print(json.dumps({'error': f'An error occurred during processing: {e}'}))
    sys.exit(1)