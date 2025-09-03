const { spawn } = require('child_process');
const admin = require('firebase-admin');
const db = admin.firestore();

// @desc    Submit soil data for recommendation
// @route   POST /api/data/submit
// @access  Private
exports.submitData = async (req, res) => {
    try {
        const { location, nitrogen, potassium, phosphorus, humidity, rainfall } = req.body;
        const userId = req.user.uid;

        const pythonProcess = spawn('python', [
            'ml_model.py',
            JSON.stringify({ location, nitrogen, potassium, phosphorus, humidity, rainfall })
        ]);

        let resultData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code === 0) {
                try {
                    const recommendation = JSON.parse(resultData);

                    await db.collection('soilData').add({
                        user: userId,
                        location,
                        nitrogen,
                        potassium,
                        phosphorus,
                        humidity,
                        rainfall,
                        recommended_crop: recommendation.crop,
                        recommended_fertilizer: recommendation.fertilizer,
                        confidence_score: recommendation.confidence_score,
                        timestamp: new Date().toISOString()
                    });

                    res.json({ recommendation });
                } catch (e) {
                    console.error('Error parsing Python output or saving to Firestore:', e);
                    res.status(500).send('Server error processing recommendation.');
                }
            } else {
                console.error(`Python script exited with code ${code}. Error: ${errorData}`);
                res.status(500).send('Server error running ML model. Details in server logs.');
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
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
