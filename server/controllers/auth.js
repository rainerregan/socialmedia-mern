import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

/** REGISTER USER */
export const register = async (req, res) => {
  try {

    // Setting a parameter of request object that contains all of these properties
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Create a salt for password encryption
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // Save user
    const savedUser = await newUser.save();

    // Send response
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, pasword } = req.body;
    const user = await User.findOne({ email: email });

    // If the user is not found
    if(!user) return res.status(400).json({ msg: "User does not exists." });

    const isMatch = await bcrypt.compare(password, user.password);

    // If the password mismatch
    if(!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    // Create token if user is successfully logged in
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Delete password so it is not sent back to the front-end

    // Return the token and user data
    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}