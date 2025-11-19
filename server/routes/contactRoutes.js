import express from 'express';
import { createContact } from '../controllers/contactController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// public POST — userAuth is optional; it attaches req.user if a valid token exists
router.post('/', userAuth, createContact);

export default router;