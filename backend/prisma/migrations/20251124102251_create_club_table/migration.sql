-- CreateEnum
CREATE TYPE "Faculty" AS ENUM ('COMPUTING', 'ENGINEERING', 'BUSINESS', 'HUMANITIES', 'SCIENCE', 'SLIIT_BUSINESS_SCHOOL', 'ALL_FACULTIES');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('WORKSHOP', 'COMPETITION', 'SEMINAR', 'CULTURAL', 'SPORTS', 'CAREER', 'ACADEMIC', 'SOCIAL', 'PROFESSIONAL', 'INDUSTRY_VISIT', 'JOB_FAIR', 'CAREER_WORKSHOP', 'INTERVIEW_PREPARATION', 'NETWORKING_EVENT', 'PROFESSIONAL_DEVELOPMENT', 'INTERNSHIP_PROGRAM', 'GUEST_LECTURE');

-- CreateEnum
CREATE TYPE "Price" AS ENUM ('Free', 'Paid');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive', 'Cancelled', 'Completed', 'Draft');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "faculty" "Faculty" NOT NULL,
    "category" "Category" NOT NULL,
    "organizer" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "price" "Price" NOT NULL DEFAULT 'Free',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "hasRegistration" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "tags" TEXT[],
    "requirements" TEXT[],
    "agenda" JSONB,
    "speakers" JSONB,
    "contact" JSONB,
    "company" TEXT,
    "industry" TEXT,
    "jobOpportunities" TEXT,
    "internshipOpportunities" TEXT,
    "skillsRequired" TEXT,
    "dresscode" TEXT,
    "image" TEXT,
    "prizes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "memberCount" INTEGER,
    "establishedYear" INTEGER,
    "category" TEXT,
    "faculty" TEXT,
    "status" TEXT,
    "mission" TEXT,
    "keyActivities" TEXT,
    "achievements" TEXT,
    "eventsCount" INTEGER,
    "studentSatisfaction" DOUBLE PRECISION,
    "awards" TEXT,
    "digitalInitiatives" TEXT,
    "joinUrl" TEXT,
    "contactInfo" TEXT,
    "imageFilename" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
