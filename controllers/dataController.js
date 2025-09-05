const axios = require('axios');
const admin = require('firebase-admin');
const db = admin.firestore();

// @desc    Submit soil data for recommendation
// @route   POST /api/data/submit
// @access  Private
exports.submitData = async (req, res) => {
    try {
        const { location, nitrogen, potassium, phosphorus, temperature, humidity, ph, rainfall, moisture, carbon, soil, crop_input } = req.body;
        const userId = req.user.uid;

        // The final ML model API endpoint
        const mlApiUrl = 'https://crop-fertilizer-api.onrender.com/predict';

        // Transform the data to match the ML model's expected format
        const mlData = {
            N: nitrogen,
            P: phosphorus,
            K: potassium,
            temperature,
            humidity,
            ph,
            rainfall,
            moisture,
            carbon,
            soil,
            crop_input
        };

        const mlApiResponse = await axios.post(mlApiUrl, mlData);
        const recommendation = mlApiResponse.data;

        // Add a safety check for undefined values
        const validRecommendation = {
            recommended_crop: recommendation.crop || 'Unknown',
            recommended_fertilizer_type: (recommendation.fertilizer && recommendation.fertilizer['fertilizer-type']) || 'Unknown',
            recommended_fertilizer_remark: (recommendation.fertilizer && recommendation.fertilizer.remark) || 'No remark provided',
        };

        // Save the data and recommendation to Firestore
        await db.collection('soilData').add({
            user: userId,
            location,
            nitrogen,
            potassium,
            phosphorus,
            humidity,
            ph,
            rainfall,
            moisture,
            carbon,
            soil,
            crop_input,
            ...validRecommendation, // Spread the validated recommendation
            timestamp: new Date().toISOString()
        });

        res.json({ recommendation: validRecommendation });

    } catch (err) {
        console.error('Error in ML API request:', err.message);
        res.status(500).send('Server error processing recommendation.');
    }
};

// @desc    Get user's past recommendations
// @route   GET /api/data/history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.uid;
        const historyRef = db.collection('soilData').where('user', '==', userId).orderBy('timestamp', 'desc');
        const historyDocs = await historyRef.get();
        
        const historyData = historyDocs.docs.map(doc => doc.data());

        res.json(historyData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
    }
};
