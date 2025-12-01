-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT,
    "views" INTEGER,
    "priority" TEXT,
    "category" TEXT,
    "faculty" TEXT,
    "description" TEXT,
    "targetAudience" TEXT,
    "expiresAt" TIMESTAMP(3),
    "attachments" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactPerson" TEXT,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
