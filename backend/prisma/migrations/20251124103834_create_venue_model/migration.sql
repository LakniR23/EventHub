-- CreateEnum
CREATE TYPE "VenueCategory" AS ENUM ('AUDITORIUM', 'LECTURE_HALL', 'LABORATORY', 'SPORTS_FACILITY', 'OUTDOOR_VENUE', 'CONFERENCE_ROOM', 'COMPUTER_LAB', 'SEMINAR_HALL', 'MULTIPURPOSE_HALL', 'WORKSHOP_SPACE');

-- CreateEnum
CREATE TYPE "VenueAvailability" AS ENUM ('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'WEATHER_DEPENDENT');

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "VenueCategory" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "facilities" TEXT[],
    "availability" "VenueAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "bookingContact" TEXT NOT NULL,
    "directionsFromMainGate" TEXT,
    "directionsFromParking" TEXT,
    "landmarks" TEXT[],
    "nearbyFacilities" TEXT[],
    "suitableEvents" TEXT[],
    "technicalSpecs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bookingInstructions" TEXT,
    "specialRequirements" TEXT,
    "accessibilityFeatures" TEXT[],
    "hourlyRate" DOUBLE PRECISION,
    "dailyRate" DOUBLE PRECISION,
    "floor" TEXT,
    "building" TEXT,
    "roomNumber" TEXT,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);
