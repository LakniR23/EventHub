import express from "express";
import {
    createVenue,
    getAllVenues,
    getVenueById,
    updateVenue,
    deleteVenue
} from "../controllers/venueController.js";

const router = express.Router();

router.post("/venues", createVenue);
router.get("/venues", getAllVenues);
router.get("/venues/:id", getVenueById);
router.put("/venues/:id", updateVenue);
router.delete("/venues/:id", deleteVenue);

export default router;