import express from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router();

// Create a POST route with controller 'login'
router.post('/login', login);

export default router;