const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    
    // Create a Firestore document for the user
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      createdAt: new Date().toISOString()
    });
    
    const payload = {
        user: {
            uid: userRecord.uid,
            email: userRecord.email,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        }
    );
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({ msg: 'User already exists' });
    }
    console.error('Registration Error:', error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get custom token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await admin.auth().getUserByEmail(email);
    const payload = {
        user: {
            uid: user.uid,
            email: user.email,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
    );
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(400).send('Invalid Credentials');
  }
};