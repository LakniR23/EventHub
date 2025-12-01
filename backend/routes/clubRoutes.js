import express from "express";
import {
    createClub,
    getAllClubs,
    getClub,
    updateClub,
    deleteClub
} from "../controllers/clubController.js";

const router = express.Router();

router.post("/clubs", createClub);
router.get("/clubs", getAllClubs);
router.get("/clubs/:id", getClub);
router.put("/clubs/:id", updateClub);
router.delete("/clubs/:id", deleteClub);

export default router;