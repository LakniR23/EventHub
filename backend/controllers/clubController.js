import prisma from "../db.js";
import fs from 'fs';
import path from 'path';

// Create a new club
export const createClub = async (req, res) => {
    try {
        const {
            name,
            description,
            memberCount,
            establishedYear,
            category,
            faculty,
            status,
            mission,
            keyActivities,
            achievements,
            eventsCount,
            studentSatisfaction,
            awards,
            digitalInitiatives,
            joinUrl,
            contactInfo,
            imageFilename,
            imageData
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Club name is required' });
        }

        // Save image if provided
        if (imageData && imageFilename) {
            try {
                const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'club-photos');
                fs.mkdirSync(uploadsDir, { recursive: true });

                const matches = String(imageData).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
                const base64 = matches ? matches[2] : imageData;
                const buffer = Buffer.from(base64, 'base64');
                const filePath = path.join(uploadsDir, imageFilename);

                fs.writeFileSync(filePath, buffer);
            } catch (e) {
                console.error('Failed to save club image', e);
            }
        }

        const club = await prisma.club.create({
            data: {
                name,
                description,
                memberCount,
                establishedYear,
                category,
                faculty,
                status,
                mission,
                keyActivities,
                achievements,
                eventsCount,
                studentSatisfaction,
                awards,
                digitalInitiatives,
                joinUrl,
                contactInfo,
                imageFilename
            }
        });

        return res.status(201).json(club);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get all clubs
export const getAllClubs = async (req, res) => {
    try {
        const raw = await prisma.$queryRaw`
            SELECT id, name, description, "memberCount", "establishedYear", 
                   category, faculty, status, mission, "keyActivities", 
                   achievements, "eventsCount", "studentSatisfaction", 
                   awards, "digitalInitiatives", "joinUrl", "contactInfo",
                   "imageFilename"
            FROM "Club"
            ORDER BY name ASC
        `;

        const BASE = process.env.BACKEND_BASE || 'http://localhost:5000';

        const enhanced = raw.map((c) => ({
            ...c,
            imageUrl: c.imageFilename ? `${BASE}/uploads/club-photos/${c.imageFilename}` : null,
            image: c.imageFilename ? `${BASE}/uploads/club-photos/${c.imageFilename}` : null,
            // Ensure numeric fields are properly converted from BigInt to Number
            id: Number(c.id),
            memberCount: c.memberCount ? Number(c.memberCount) : 0,
            establishedYear: c.establishedYear ? Number(c.establishedYear) : null,
            eventsCount: c.eventsCount ? Number(c.eventsCount) : 0,
            studentSatisfaction: c.studentSatisfaction ? Number(c.studentSatisfaction) : null
        }));

        return res.status(200).json(enhanced);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get a single club
export const getClub = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const raw = await prisma.$queryRaw`
            SELECT id, name, description, "memberCount", "establishedYear", 
                   category, faculty, status, mission, "keyActivities", 
                   achievements, "eventsCount", "studentSatisfaction", 
                   awards, "digitalInitiatives", "joinUrl", "contactInfo",
                   "imageFilename"
            FROM "Club"
            WHERE id = ${id}
            LIMIT 1
        `;

        if (!raw || raw.length === 0)
            return res.status(404).json({ message: 'Club not found' });

        const club = raw[0];
        const BASE = process.env.BACKEND_BASE || 'http://localhost:5000';

        return res.status(200).json({
            ...club,
            id: Number(club.id),
            memberCount: club.memberCount ? Number(club.memberCount) : 0,
            establishedYear: club.establishedYear ? Number(club.establishedYear) : null,
            eventsCount: club.eventsCount ? Number(club.eventsCount) : 0,
            studentSatisfaction: club.studentSatisfaction ? Number(club.studentSatisfaction) : null,
            imageUrl: club.imageFilename ? `${BASE}/uploads/club-photos/${club.imageFilename}` : null,
            image: club.imageFilename ? `${BASE}/uploads/club-photos/${club.imageFilename}` : null
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update a club
export const updateClub = async (req, res) => {
    try {
        const {
            name,
            description,
            memberCount,
            establishedYear,
            category,
            faculty,
            status,
            mission,
            keyActivities,
            achievements,
            eventsCount,
            studentSatisfaction,
            awards,
            digitalInitiatives,
            joinUrl,
            contactInfo,
            imageFilename,
            imageData
        } = req.body;

        // Save new image if provided
        if (imageData && imageFilename) {
            try {
                const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'club-photos');
                fs.mkdirSync(uploadsDir, { recursive: true });

                const matches = String(imageData).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
                const base64 = matches ? matches[2] : imageData;
                const buffer = Buffer.from(base64, 'base64');
                const filePath = path.join(uploadsDir, imageFilename);

                fs.writeFileSync(filePath, buffer);
            } catch (e) {
                console.error('Failed to save club image (update)', e);
            }
        }

        const club = await prisma.club.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                description,
                memberCount,
                establishedYear,
                category,
                faculty,
                status,
                mission,
                keyActivities,
                achievements,
                eventsCount,
                studentSatisfaction,
                awards,
                digitalInitiatives,
                joinUrl,
                contactInfo,
                imageFilename
            }
        });

        return res.status(200).json(club);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Club not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};

// Delete a club
export const deleteClub = async (req, res) => {
    try {
        await prisma.club.delete({
            where: { id: parseInt(req.params.id) }
        });

        return res.status(200).json({ message: 'Club deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Club not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};
