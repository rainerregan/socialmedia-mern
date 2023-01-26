import express from 'express';
import { login } from '../controllers/auth.js';

/**
 * ========================================================
 * Auth Routes
 * ========================================================
 * This file will handle all web routes for authentication.
 * ========================================================
 */

const router = express.Router();

// Create a POST route with controller 'login'
router.post('/login', login);

export default router;