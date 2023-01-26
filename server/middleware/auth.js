import jwt from 'jsonwebtoken';

/**
 * Verify Token Middleware
 * 
 * Middleware for checking the user token. To make sure the user is logged in.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // Get token from 'Authorization' header from request

    if(!token) {
      return res.status(403).send("Access Denied");
    }

    if(token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); // Remove 'Bearer ' from the token to get the actual token
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}