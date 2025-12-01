import prisma from "../db.js";

// Create a new venue
export const createVenue = async (req, res) => {
    try {
        const { 
            name, 
            category, 
            capacity, 
            location, 
            description, 
            image, 
            facilities, 
            availability, 
            bookingContact, 
            directionsFromMainGate, 
            directionsFromParking, 
            landmarks, 
            nearbyFacilities, 
            suitableEvents, 
            technicalSpecs, 
            isActive, 
            bookingInstructions, 
            specialRequirements, 
            accessibilityFeatures, 
            hourlyRate, 
            dailyRate, 
            floor, 
            building, 
            roomNumber 
        } = req.body;
        
        if (!name || !category || !capacity || !location || !description || !bookingContact) {
            return res.status(400).json({ message: 'Name, category, capacity, location, description, and booking contact are required' });
        }

        const venue = await prisma.venue.create({
            data: {
                name,
                category,
                capacity: parseInt(capacity),
                location,
                description,
                image,
                facilities: facilities || [],
                availability: availability || 'AVAILABLE',
                bookingContact,
                directionsFromMainGate,
                directionsFromParking,
                landmarks: landmarks || [],
                nearbyFacilities: nearbyFacilities || [],
                suitableEvents: suitableEvents || [],
                technicalSpecs,
                isActive: isActive !== undefined ? isActive : true,
                bookingInstructions,
                specialRequirements,
                accessibilityFeatures: accessibilityFeatures || [],
                hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
                dailyRate: dailyRate ? parseFloat(dailyRate) : null,
                floor,
                building,
                roomNumber
            }
        });

        return res.status(201).json(venue);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get all venues
export const getAllVenues = async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
        return res.status(200).json(venues);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Get a single venue by id
export const getVenueById = async (req, res) => {
    try {
        const venue = await prisma.venue.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        
        return res.status(200).json(venue);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Update an existing venue
export const updateVenue = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.capacity) {
            updates.capacity = parseInt(updates.capacity);
        }
        if (updates.hourlyRate) {
            updates.hourlyRate = parseFloat(updates.hourlyRate);
        }
        if (updates.dailyRate) {
            updates.dailyRate = parseFloat(updates.dailyRate);
        }

        const venue = await prisma.venue.update({
            where: { id: parseInt(req.params.id) },
            data: updates
        });

        return res.status(200).json(venue);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Venue not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};

// Delete a venue
export const deleteVenue = async (req, res) => {
    try {
        await prisma.venue.delete({
            where: { id: parseInt(req.params.id) }
        });

        return res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Venue not found' });
        }
        return res.status(500).json({ message: err.message });
    }
};