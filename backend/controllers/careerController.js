import prisma from "../db.js";

// Create a new career
export const createCareer = async (req, res) => {
    try {
        const { 
            title, 
            category, 
            featured, 
            type, 
            description, 
            about, 
            date, 
            startTime, 
            endTime, 
            location, 
            company, 
            participants, 
            maxParticipants, 
            price, 
            jobOpportunities, 
            internshipOpportunities, 
            skillsRequired, 
            dressCode, 
            agenda, 
            speakers, 
            requirements, 
            availableSpots, 
            registerUrl, 
            contactEmail, 
            contactPhone, 
            contactPerson, 
            tags, 
            imageFilename 
        } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const career = await prisma.career.create({
            data: {
                title,
                category,
                featured: featured || false,
                type,
                description,
                about,
                date: date ? new Date(date) : null,
                startTime,
                endTime,
                location,
                company,
                participants,
                maxParticipants,
                price,
                jobOpportunities,
                internshipOpportunities,
                skillsRequired,
                dressCode,
                agenda,
                speakers,
                requirements,
                availableSpots,
                registerUrl,
                contactEmail,
                contactPhone,
                contactPerson,
                tags,
                imageFilename
            }
        });

        return res.status(201).json(career);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get all careers
export const getAllCareers = async (req, res) => {
    try {
        const careers = await prisma.career.findMany({
            orderBy: { id: 'desc' }
        });
        return res.status(200).json(careers);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get a single career by id
export const getCareerById = async (req, res) => {
    try {
        const career = await prisma.career.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }
        
        return res.status(200).json(career);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update an existing career
export const updateCareer = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.date) {
            updates.date = new Date(updates.date);
        }

        const career = await prisma.career.update({
            where: { id: parseInt(req.params.id) },
            data: updates
        });

        return res.status(200).json(career);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Career not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};

// Delete a career
export const deleteCareer = async (req, res) => {
    try {
        await prisma.career.delete({
            where: { id: parseInt(req.params.id) }
        });

        return res.status(200).json({ message: 'Career deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Career not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};