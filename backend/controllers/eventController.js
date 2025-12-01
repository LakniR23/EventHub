import prisma from "../db.js";

export const createEvent = async (req, res) => {
  try {
    const data = req.body;
    console.log('Creating event with data:', {
      ...data,
      image: data.image ? `[Base64 image ${data.image.length} chars]` : 'No image'
    });

    // Compatibility mapping for legacy frontend values (safe, small map)
    const CATEGORY_COMPAT = {
      // legacy -> db enum
      'WORKSHOP': 'WORKSHOPS_CREATIVE'
    };

    if (data.category && CATEGORY_COMPAT[data.category]) {
      console.log(`Mapping legacy category ${data.category} -> ${CATEGORY_COMPAT[data.category]}`);
      data.category = CATEGORY_COMPAT[data.category];
    }

    // Clean and validate data before database insert
    const cleanData = {
      title: data.title,
      description: data.description,
      time: data.time,
      location: data.location,
      faculty: data.faculty,
      category: data.category,
      organizer: data.organizer,
      registeredCount: data.registeredCount || 0,
      price: data.price || 'Free',
      featured: Boolean(data.featured),
      hasRegistration: data.hasRegistration !== undefined ? Boolean(data.hasRegistration) : true,
      status: data.status || 'Active',
      tags: Array.isArray(data.tags) ? data.tags : [],
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      prizes: Array.isArray(data.prizes) ? data.prizes : [],
      updatedAt: new Date(),
    };

    // Add optional fields only if they have values (avoid null for Prisma)
    if (data.fullDescription && data.fullDescription.trim() !== '') {
      cleanData.fullDescription = data.fullDescription;
    }
    
    if (data.endDate) {
      cleanData.endDate = new Date(data.endDate);
    }
    
    if (data.maxParticipants && parseInt(data.maxParticipants) > 0) {
      cleanData.maxParticipants = parseInt(data.maxParticipants);
    }

    // Handle JSON fields - only add if they have meaningful content
    if (data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0) {
      cleanData.agenda = data.agenda;
    }
    
    if (data.speakers && Array.isArray(data.speakers) && data.speakers.length > 0) {
      cleanData.speakers = data.speakers;
    }
    
    if (data.contact && typeof data.contact === 'object' && Object.keys(data.contact).some(key => data.contact[key])) {
      cleanData.contact = data.contact;
    }

    // Handle optional string fields
    if (data.company && data.company.trim() !== '') {
      cleanData.company = data.company;
    }
    
    if (data.industry && data.industry.trim() !== '') {
      cleanData.industry = data.industry;
    }
    
    if (data.jobOpportunities && data.jobOpportunities.trim() !== '') {
      cleanData.jobOpportunities = data.jobOpportunities;
    }
    
    if (data.internshipOpportunities && data.internshipOpportunities.trim() !== '') {
      cleanData.internshipOpportunities = data.internshipOpportunities;
    }
    
    if (data.skillsRequired && data.skillsRequired.trim() !== '') {
      cleanData.skillsRequired = data.skillsRequired;
    }
    
    if (data.dresscode && data.dresscode.trim() !== '') {
      cleanData.dresscode = data.dresscode;
    }
    
    if (data.image && data.image.trim() !== '') {
      cleanData.image = data.image;
    }

    // Set date properly
    cleanData.date = new Date(data.date);

    // Store category as received (DB enum now contains the new category labels)
    // At this point `data.category` should be a valid DB enum member
    console.log('Final cleanData:', cleanData);
    const event = await prisma.event.create({
      data: cleanData,
    });

    console.log('Event created successfully:', event.id);
    return res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: "Duplicate event", 
        error: "An event with this information already exists" 
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(400).json({ 
        message: "Invalid data", 
        error: "One or more fields contain invalid data" 
      });
    }

    res.status(500).json({ 
      message: "Server Error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { category, faculty, search, featured, status } = req.query;
    
    let where = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (faculty && faculty !== 'all') {
      where.faculty = faculty;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } }
      ];
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Alias for backward compatibility
export const getEvents = getAllEvents;

export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const data = req.body;
    const eventId = Number(req.params.id);
    
    console.log('Updating event', eventId, 'with data:', {
      ...data,
      image: data.image ? `[Base64 image ${data.image.length} chars]` : 'No image'
    });

    // Check if event exists first
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Clean update data - only include fields that are defined
    const updateData = {
      updatedAt: new Date()
    };
    
    // Basic fields
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.time !== undefined) updateData.time = data.time;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.faculty !== undefined) updateData.faculty = data.faculty;
    if (data.category !== undefined) {
      // Map legacy category values when present
      const CATEGORY_COMPAT = {
        'WORKSHOP': 'WORKSHOPS_CREATIVE'
      };
      updateData.category = (data.category && CATEGORY_COMPAT[data.category]) ? CATEGORY_COMPAT[data.category] : data.category;
    }
    if (data.organizer !== undefined) updateData.organizer = data.organizer;
    if (data.registeredCount !== undefined) updateData.registeredCount = data.registeredCount;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.hasRegistration !== undefined) updateData.hasRegistration = Boolean(data.hasRegistration);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : [];
    if (data.requirements !== undefined) updateData.requirements = Array.isArray(data.requirements) ? data.requirements : [];
    if (data.prizes !== undefined) updateData.prizes = Array.isArray(data.prizes) ? data.prizes : [];

    // Optional fields - only set if they have meaningful values
    if (data.fullDescription !== undefined) {
      if (data.fullDescription && data.fullDescription.trim() !== '') {
        updateData.fullDescription = data.fullDescription;
      } else {
        // Use unset to remove the field entirely
        updateData.fullDescription = null;
      }
    }
    
    if (data.endDate !== undefined) {
      if (data.endDate) {
        updateData.endDate = new Date(data.endDate);
      } else {
        updateData.endDate = null;
      }
    }
    
    if (data.maxParticipants !== undefined) {
      if (data.maxParticipants && parseInt(data.maxParticipants) > 0) {
        updateData.maxParticipants = parseInt(data.maxParticipants);
      } else {
        updateData.maxParticipants = null;
      }
    }

    // Handle JSON fields carefully - Prisma doesn't like null for Json fields
    if (data.agenda !== undefined) {
      if (data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0) {
        updateData.agenda = data.agenda;
      }
      // If agenda is empty/null, don't include it in update (leave existing value)
    }
    
    if (data.speakers !== undefined) {
      if (data.speakers && Array.isArray(data.speakers) && data.speakers.length > 0) {
        updateData.speakers = data.speakers;
      }
      // If speakers is empty/null, don't include it in update (leave existing value)
    }
    
    if (data.contact !== undefined) {
      if (data.contact && typeof data.contact === 'object' && Object.keys(data.contact).some(key => data.contact[key])) {
        updateData.contact = data.contact;
      }
      // If contact is empty/null, don't include it in update (leave existing value)
    }

    // Handle optional string fields
    if (data.company !== undefined) {
      updateData.company = (data.company && data.company.trim() !== '') ? data.company : null;
    }
    
    if (data.industry !== undefined) {
      updateData.industry = (data.industry && data.industry.trim() !== '') ? data.industry : null;
    }
    
    if (data.jobOpportunities !== undefined) {
      updateData.jobOpportunities = (data.jobOpportunities && data.jobOpportunities.trim() !== '') ? data.jobOpportunities : null;
    }
    
    if (data.internshipOpportunities !== undefined) {
      updateData.internshipOpportunities = (data.internshipOpportunities && data.internshipOpportunities.trim() !== '') ? data.internshipOpportunities : null;
    }
    
    if (data.skillsRequired !== undefined) {
      updateData.skillsRequired = (data.skillsRequired && data.skillsRequired.trim() !== '') ? data.skillsRequired : null;
    }
    
    if (data.dresscode !== undefined) {
      updateData.dresscode = (data.dresscode && data.dresscode.trim() !== '') ? data.dresscode : null;
    }
    
    // Handle image updates properly
    if (data.image !== undefined) {
      updateData.image = (data.image && data.image.trim() !== '') ? data.image : null;
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });

    console.log('Event updated successfully:', updated.id);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update event error:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(500).json({ 
      message: "Server Error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Additional controller functions for the routes
export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Get featured events error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const events = await prisma.event.findMany({
      where: { category },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Get events by category error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: now
        },
        status: 'Active'
      },
      orderBy: { date: "asc" },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { userId } = req.body;

    // Check if event exists and has registration enabled
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.hasRegistration) {
      return res.status(400).json({ message: "Registration not available for this event" });
    }

    if (event.maxParticipants && event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Update registered count
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        registeredCount: {
          increment: 1
        }
      },
    });

    res.status(200).json({ 
      message: "Successfully registered for event",
      event: updatedEvent 
    });
  } catch (error) {
    console.error("Register for event error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
