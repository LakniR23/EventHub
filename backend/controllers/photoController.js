import fs from 'fs';
import path from 'path';
import prisma from '../db.js';

export const uploadPhotos = async (req, res) => {
  try {
    const { eventId, photographerName, clubId } = req.body;
    const files = req.files || [];

    // At least one of eventId or clubId must be provided
    if (!eventId && !clubId) {
      return res.status(400).json({ message: 'Either eventId or clubId is required' });
    }

    // Validate event if provided
    let event = null;
    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
      if (!event) return res.status(404).json({ message: 'Event not found' });
    }

    // Validate club if provided
    let club = null;
    if (clubId) {
      club = await prisma.club.findUnique({ where: { id: Number(clubId) } });
      if (!club) return res.status(404).json({ message: 'Club not found' });
    }

    if (!files.length) return res.status(400).json({ message: 'No files uploaded' });

    const created = [];
    for (const f of files) {
      const relativeUrl = `/uploads/event-photos/${f.filename}`;
      const photo = await prisma.photo.create({
        data: {
          eventId: eventId ? Number(eventId) : null,
          clubId: clubId ? Number(clubId) : null,
          url: relativeUrl,
          filename: f.filename,
          photographer: photographerName || null,
        }
      });
      created.push(photo);
    }

    return res.status(201).json({ message: 'Photos uploaded', photos: created });
  } catch (err) {
    console.error('uploadPhotos error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const { eventId, clubId } = req.query;
    const where = {};
    if (eventId) where.eventId = Number(eventId);
    if (clubId) where.clubId = Number(clubId);

    const photos = await prisma.photo.findMany({
      where,
      include: {
        club: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { uploadedAt: 'desc' },
    });

    // Add clubName to each photo for easier frontend access
    const photosWithClubName = photos.map(photo => ({
      ...photo,
      clubName: photo.club?.name || null
    }));

    res.status(200).json(photosWithClubName);
  } catch (err) {
    console.error('getPhotos error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { eventId, clubId, photographer, caption } = req.body;

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Validate event if provided
    if (eventId && eventId !== photo.eventId) {
      const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
      if (!event) return res.status(404).json({ message: 'Event not found' });
    }

    // Validate club if provided
    if (clubId && clubId !== photo.clubId) {
      const club = await prisma.club.findUnique({ where: { id: Number(clubId) } });
      if (!club) return res.status(404).json({ message: 'Club not found' });
    }

    // At least one of eventId or clubId must be provided
    const newEventId = eventId ? Number(eventId) : null;
    const newClubId = clubId ? Number(clubId) : null;
    
    if (!newEventId && !newClubId) {
      return res.status(400).json({ message: 'Either eventId or clubId is required' });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: {
        eventId: newEventId,
        clubId: newClubId,
        photographer: photographer || null,
        caption: caption || null,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Add clubName for frontend compatibility
    const photoWithClubName = {
      ...updatedPhoto,
      clubName: updatedPhoto.club?.name || null
    };

    res.status(200).json({ message: 'Photo updated', photo: photoWithClubName });
  } catch (err) {
    console.error('updatePhoto error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // remove file from disk if exists
    const filePath = path.join(process.cwd(), 'public', photo.url.replace('/uploads/', ''));
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // ignore if file missing
    }

    await prisma.photo.delete({ where: { id } });
    res.status(200).json({ message: 'Photo deleted' });
  } catch (err) {
    console.error('deletePhoto error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
