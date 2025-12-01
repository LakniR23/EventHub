import prisma from "../db.js";

export const createRegistration = async (req, res) => {
  try {
    const { eventId, name, email, phone, registrationNumber, confirmPresence, notes } = req.body;
    const { receipt } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // If eventId provided, check event
    let event = null;
    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
      if (!event) return res.status(404).json({ message: 'Event not found' });
      if (!event.hasRegistration) return res.status(400).json({ message: 'Registration not enabled for this event' });
      if (event.maxParticipants && event.registeredCount >= event.maxParticipants) return res.status(400).json({ message: 'Event is full' });
    }

    // If event is paid, require a receipt
    if (event && String(event.price) && String(event.price).toLowerCase() === 'paid' && !receipt) {
      return res.status(400).json({ message: 'Payment receipt is required for paid events.' });
    }

    const created = await prisma.registration.create({
      data: {
        eventId: event ? Number(eventId) : null,
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : null,
        registrationNumber: registrationNumber ? String(registrationNumber) : null,
        receipt: receipt ? String(receipt) : null,
        confirmPresence: Boolean(confirmPresence),
        notes: notes ? String(notes) : null
      }
    });

    // increment event.registeredCount if related event exists
    if (event) {
      await prisma.event.update({
        where: { id: Number(eventId) },
        data: { registeredCount: { increment: 1 } }
      });
    }

    return res.status(201).json(created);
  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const regs = await prisma.registration.findMany({ orderBy: { createdAt: 'desc' }, include: { event: true } });
    return res.status(200).json(regs);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRegistrationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const reg = await prisma.registration.findUnique({ where: { id }, include: { event: true } });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    return res.status(200).json(reg);
  } catch (error) {
    console.error('Get registration by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Fetch registration to know associated event
    const reg = await prisma.registration.findUnique({ where: { id } });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    await prisma.registration.delete({ where: { id } });

    // decrement event.registeredCount if related
    if (reg.eventId) {
      try {
        await prisma.event.update({ where: { id: reg.eventId }, data: { registeredCount: { decrement: 1 } } });
      } catch (e) {
        // non-fatal if event not found
        console.warn('Failed to decrement event count after registration delete:', e.message);
      }
    }

    return res.status(200).json({ message: 'Registration deleted' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
