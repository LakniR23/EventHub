import express from 'express';
import { createRegistration, getAllRegistrations, getRegistrationById, deleteRegistration } from '../controllers/registrationController.js';

const router = express.Router();

// POST /api/registrations
router.post('/registrations', createRegistration);

// GET /api/registrations
router.get('/registrations', getAllRegistrations);

// GET /api/registrations/:id
router.get('/registrations/:id', getRegistrationById);

// DELETE /api/registrations/:id
router.delete('/registrations/:id', deleteRegistration);

export default router;
