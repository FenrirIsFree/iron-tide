-- CreateEnum
CREATE TYPE "GuildRank" AS ENUM ('ADMIN', 'FOUNDER', 'ADMIRAL', 'COMMODORE', 'OFFICER', 'MIDSHIPMAN', 'SAILOR', 'CABIN_BOY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "inGameName" TEXT,
    "rank" "GuildRank" NOT NULL DEFAULT 'CABIN_BOY',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supabaseId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ships" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "shipClass" TEXT NOT NULL,
    "role" TEXT,
    "faction" TEXT,
    "hp" INTEGER,
    "speed" DOUBLE PRECISION,
    "maneuverability" INTEGER,
    "broadsideArmor" DOUBLE PRECISION,
    "cargoHold" INTEGER,
    "crewCapacity" INTEGER,
    "displacement" TEXT,
    "integrity" INTEGER,
    "description" TEXT,
    "weaponClass" TEXT,
    "sternSlots" INTEGER NOT NULL DEFAULT 0,
    "broadsideSlots" INTEGER NOT NULL DEFAULT 0,
    "bowSlots" INTEGER NOT NULL DEFAULT 0,
    "swivelGuns" INTEGER NOT NULL DEFAULT 0,
    "mortarSlots" INTEGER NOT NULL DEFAULT 0,
    "mortarMaxCaliber" INTEGER,
    "specialWeaponSlots" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weapons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weightClass" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "penetration" DOUBLE PRECISION,
    "penetrationMulti" TEXT,
    "loading" DOUBLE PRECISION,
    "range" INTEGER,
    "rangeMin" INTEGER,
    "maxAngle" INTEGER,
    "accuracySpread" DOUBLE PRECISION,
    "damage" INTEGER,
    "splashRadius" INTEGER,
    "reduction" DOUBLE PRECISION,
    "preparation" DOUBLE PRECISION,
    "firingTime" INTEGER,
    "damageUnit" TEXT,
    "caliber" INTEGER,
    "placementRestriction" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "weapons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upgrades" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slot" TEXT,
    "description" TEXT,
    "effect" TEXT,
    "effects" JSONB,

    CONSTRAINT "upgrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ammo_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "effect" TEXT,

    CONSTRAINT "ammo_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "effect" TEXT,

    CONSTRAINT "consumables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "faction" TEXT,
    "gameId" TEXT,

    CONSTRAINT "crew_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "nickname" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadouts" (
    "id" TEXT NOT NULL,
    "userShipId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Loadout 1',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loadouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadout_weapons" (
    "id" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "loadout_weapons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadout_upgrades" (
    "id" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL,
    "upgradeId" TEXT NOT NULL,

    CONSTRAINT "loadout_upgrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadout_ammo" (
    "id" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL,
    "ammoTypeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loadout_ammo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadout_crew" (
    "id" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL,
    "crewTypeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "loadout_crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loadout_consumables" (
    "id" TEXT NOT NULL,
    "loadoutId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "loadout_consumables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_resources" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_consumables" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_consumables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_currencies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ammo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ammoTypeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ammo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ships_name_key" ON "ships"("name");

-- CreateIndex
CREATE UNIQUE INDEX "weapons_name_key" ON "weapons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "upgrades_name_key" ON "upgrades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ammo_types_name_key" ON "ammo_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "consumables_name_key" ON "consumables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "resources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_key" ON "currencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "crew_types_name_key" ON "crew_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_resources_userId_resourceId_key" ON "user_resources"("userId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_consumables_userId_consumableId_key" ON "user_consumables"("userId", "consumableId");

-- CreateIndex
CREATE UNIQUE INDEX "user_currencies_userId_currencyId_key" ON "user_currencies"("userId", "currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_ammo_userId_ammoTypeId_key" ON "user_ammo"("userId", "ammoTypeId");

-- AddForeignKey
ALTER TABLE "user_ships" ADD CONSTRAINT "user_ships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ships" ADD CONSTRAINT "user_ships_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_userShipId_fkey" FOREIGN KEY ("userShipId") REFERENCES "user_ships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_weapons" ADD CONSTRAINT "loadout_weapons_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "loadouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_weapons" ADD CONSTRAINT "loadout_weapons_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "weapons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_upgrades" ADD CONSTRAINT "loadout_upgrades_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "loadouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_upgrades" ADD CONSTRAINT "loadout_upgrades_upgradeId_fkey" FOREIGN KEY ("upgradeId") REFERENCES "upgrades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_ammo" ADD CONSTRAINT "loadout_ammo_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "loadouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_ammo" ADD CONSTRAINT "loadout_ammo_ammoTypeId_fkey" FOREIGN KEY ("ammoTypeId") REFERENCES "ammo_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_crew" ADD CONSTRAINT "loadout_crew_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "loadouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_crew" ADD CONSTRAINT "loadout_crew_crewTypeId_fkey" FOREIGN KEY ("crewTypeId") REFERENCES "crew_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_consumables" ADD CONSTRAINT "loadout_consumables_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "loadouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loadout_consumables" ADD CONSTRAINT "loadout_consumables_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "consumables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resources" ADD CONSTRAINT "user_resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resources" ADD CONSTRAINT "user_resources_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_consumables" ADD CONSTRAINT "user_consumables_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_consumables" ADD CONSTRAINT "user_consumables_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "consumables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_currencies" ADD CONSTRAINT "user_currencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_currencies" ADD CONSTRAINT "user_currencies_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ammo" ADD CONSTRAINT "user_ammo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ammo" ADD CONSTRAINT "user_ammo_ammoTypeId_fkey" FOREIGN KEY ("ammoTypeId") REFERENCES "ammo_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
