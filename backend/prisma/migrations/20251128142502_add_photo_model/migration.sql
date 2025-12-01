-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "photographer" TEXT,
    "caption" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
