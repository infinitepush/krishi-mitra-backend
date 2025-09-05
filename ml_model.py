import sys
import json

try:
    input_data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError) as e:
    print(json.dumps({'error': f'Invalid input data: {e}'}))
    sys.exit(1)

try:
    # Input data ko variables mein store karein
    N = input_data.get('N')
    P = input_data.get('P')
    K = input_data.get('K')
    temperature = input_data.get('temperature')
    humidity = input_data.get('humidity')
    ph = input_data.get('ph')
    rainfall = input_data.get('rainfall')
    moisture = input_data.get('moisture')
    carbon = input_data.get('carbon')
    soil = input_data.get('soil')
    crop_input = input_data.get('crop_input')

    # --- Yahan aapka Machine Learning Model ka logic aayega ---
    # Abhi hum ek simple example ke liye if/else logic ka istemal karenge.
    # Shubham (ML team member) is code ko asli model se replace kar dega.

    # Example recommendation logic
    recommended_crop = "Sugarcane"
    recommended_fertilizer_type = "Urea"
    recommended_fertilizer_remark = "Apply as per soil requirement"
    confidence_score = "Low"

    # Ek simple recommendation logic ka udharan:
    if N > 100 and P > 50:
        recommended_crop = "Rice"
        recommended_fertilizer_type = "Urea"
        recommended_fertilizer_remark = "Apply as per soil requirement"
        confidence_score = "High"
    elif K > 40 and rainfall > 150:
        recommended_crop = "Maize"
        recommended_fertilizer_type = "NPK"
        recommended_fertilizer_remark = "Apply as per soil requirement"
        confidence_score = "Medium"
    else:
        recommended_crop = "Sugarcane"
        recommended_fertilizer_type = "Potash"
        recommended_fertilizer_remark = "Apply as per soil requirement"
        confidence_score = "Low"

    # Output ko JSON format mein taiyar karein
    output = {
        "crop": recommended_crop,
        "fertilizer": {
            "fertilizer-type": recommended_fertilizer_type,
            "remark": recommended_fertilizer_remark
        },
        "confidence_score": confidence_score
    }

    # Output ko Node.js backend ko wapas bhejne ke liye print karein
    print(json.dumps(output))

except Exception as e:
    print(json.dumps({'error': f'An error occurred during processing: {e}'}))
    sys.exit(1)
