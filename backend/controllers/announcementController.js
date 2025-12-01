import prisma from "../db.js";

// Create a new announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { 
            title, 
            tag, 
            date, 
            author, 
            views, 
            priority, 
            category, 
            faculty, 
            description, 
            targetAudience, 
            expiresAt, 
            attachments, 
            contactEmail, 
            contactPhone, 
            contactPerson 
        } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                tag,
                date: date ? new Date(date) : new Date(),
                author,
                views: views || 0,
                priority,
                category,
                faculty,
                description,
                targetAudience,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                attachments,
                contactEmail,
                contactPhone,
                contactPerson
            }
        });

        return res.status(201).json(announcement);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { date: 'desc' }
        });
        return res.status(200).json(announcements);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get a single announcement by id
export const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        
        return res.status(200).json(announcement);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update an existing announcement
export const updateAnnouncement = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.date) {
            updates.date = new Date(updates.date);
        }
        if (updates.expiresAt) {
            updates.expiresAt = new Date(updates.expiresAt);
        }

        const announcement = await prisma.announcement.update({
            where: { id: parseInt(req.params.id) },
            data: updates
        });

        return res.status(200).json(announcement);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        await prisma.announcement.delete({
            where: { id: parseInt(req.params.id) }
        });

        return res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};