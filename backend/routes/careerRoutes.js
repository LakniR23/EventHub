import express from "express";
import {
    createCareer,
    getAllCareers,
    getCareerById,
    updateCareer,
    deleteCareer
} from "../controllers/careerController.js";

const router = express.Router();

router.post("/careers", createCareer);
router.get("/careers", getAllCareers);
router.get("/careers/:id", getCareerById);
router.put("/careers/:id", updateCareer);
router.delete("/careers/:id", deleteCareer);

export default router;