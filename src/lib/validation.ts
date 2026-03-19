import { z } from 'zod'

// ============================================================
// AUTH
// ============================================================

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be 30 characters or less').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  inGameName: z.string().max(50).nullable().optional(),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// ============================================================
// IDS (UUID validation)
// ============================================================

export const uuidSchema = z.string().uuid('Invalid ID')

// ============================================================
// FLEET
// ============================================================

export const addShipSchema = z.object({
  shipId: uuidSchema,
  nickname: z.string().max(50).optional(),
})

export const updateShipNicknameSchema = z.object({
  userShipId: uuidSchema,
  nickname: z.string().max(50).nullable(),
})

export const renameLoadoutSchema = z.object({
  loadoutId: uuidSchema,
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
})

export const loadoutItemSchema = z.object({
  loadoutId: uuidSchema,
  itemId: uuidSchema,
})

export const addWeaponSchema = z.object({
  loadoutId: uuidSchema,
  weaponId: uuidSchema,
  position: z.enum(['stern', 'port', 'starboard', 'bow', 'mortar', 'special']),
})

export const updateCrewQuantitySchema = z.object({
  loadoutCrewId: uuidSchema,
  quantity: z.number().int().min(0).max(9999),
})

// ============================================================
// INVENTORY
// ============================================================

export const updateQuantitySchema = z.object({
  itemId: uuidSchema,
  quantity: z.number().int().min(0).max(999999),
})

export const updateCurrencySchema = z.object({
  currencyId: uuidSchema,
  amount: z.number().min(0).max(999999999),
})

export const toggleVisibilitySchema = z.object({
  type: z.enum(['resource', 'consumable', 'currency', 'ammo']),
  itemId: uuidSchema,
})

// ============================================================
// ROSTER
// ============================================================

export const updateRankSchema = z.object({
  targetUserId: uuidSchema,
  newRank: z.enum(['FOUNDER', 'ADMIRAL', 'COMMODORE', 'OFFICER', 'MIDSHIPMAN', 'SAILOR', 'CABIN_BOY']),
})

// ============================================================
// SQUADRONS
// ============================================================

export const squadronNameSchema = z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less')

export const squadronShipSchema = z.object({
  squadronId: uuidSchema,
  userShipId: uuidSchema,
})

export const reorderSlotsSchema = z.object({
  squadronId: uuidSchema,
  slotIds: z.array(uuidSchema).min(1),
})
