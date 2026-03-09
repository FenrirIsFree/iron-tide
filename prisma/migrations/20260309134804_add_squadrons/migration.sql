-- CreateTable
CREATE TABLE "squadrons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'New Squadron',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "squadrons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "squadron_slots" (
    "id" TEXT NOT NULL,
    "squadronId" TEXT NOT NULL,
    "userShipId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "squadron_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "squadron_slots_squadronId_userShipId_key" ON "squadron_slots"("squadronId", "userShipId");

-- AddForeignKey
ALTER TABLE "squadrons" ADD CONSTRAINT "squadrons_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "squadron_slots" ADD CONSTRAINT "squadron_slots_squadronId_fkey" FOREIGN KEY ("squadronId") REFERENCES "squadrons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "squadron_slots" ADD CONSTRAINT "squadron_slots_userShipId_fkey" FOREIGN KEY ("userShipId") REFERENCES "user_ships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
