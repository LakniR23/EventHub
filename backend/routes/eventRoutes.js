import express from "express";
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getFeaturedEvents,
    getEventsByCategory,
    getUpcomingEvents,
    registerForEvent
} from "../controllers/eventController.js";
import { 
    validateEvent, 
    validateEventUpdate, 
    validateRegistration 
} from "../middleware/eventValidation.js";

const router = express.Router();

// Main CRUD routes
router.post("/events", validateEvent, createEvent);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.put("/events/:id", validateEventUpdate, updateEvent);
router.delete("/events/:id", deleteEvent);

// Additional routes
router.get("/events-featured", getFeaturedEvents);
router.get("/events/category/:category", getEventsByCategory);
router.get("/events-upcoming", getUpcomingEvents);
router.post("/events/:id/register", validateRegistration, registerForEvent);

export default router;