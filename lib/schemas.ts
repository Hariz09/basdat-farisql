/**
 * Zod schemas — one per DB table, field names in camelCase.
 *
 * These are the single source of truth for types.
 * To swap mock data for a real DB (e.g. Neon/PostgreSQL):
 *   1. Keep these schemas unchanged.
 *   2. Replace the function bodies in the lib/mock-*.ts files with
 *      real SQL queries (e.g. using `@neondatabase/serverless` or `drizzle-orm`).
 *   3. Parse every DB row through the matching `.parse()` or `.safeParse()` call
 *      so runtime validation catches schema drift immediately.
 */

import { z } from "zod";

// ID columns are UUID in the real DB.  Mock data uses short strings for
// readability; the `.min(1)` validator accepts both during development.
// Switch to `z.string().uuid()` once all IDs are real UUIDs from Neon.

// 1. USER_ACCOUNT

export const UserAccountSchema = z.object({
  userId: z.string().min(1),
  username: z.string().max(100),
  password: z.string().max(255),
});

// 2. ROLE

export const RoleSchema = z.object({
  roleId: z.string().min(1),
  roleName: z.string().max(50),
});

// 3. ACCOUNT_ROLE  (composite PK: roleId + userId)

export const AccountRoleSchema = z.object({
  roleId: z.string().min(1),
  userId: z.string().min(1),
});

// 4. CUSTOMER

export const CustomerSchema = z.object({
  customerId: z.string().min(1),
  fullName: z.string().max(100),
  phoneNumber: z.string().max(20).nullable().optional(),
  userId: z.string().min(1),
});

// 5. ORGANIZER

export const OrganizerSchema = z.object({
  organizerId: z.string().min(1),
  organizerName: z.string().max(100),
  contactEmail: z.email().nullable().optional(),
  userId: z.string().min(1),
});

// 5.5. ADMIN

export const AdminSchema = z.object({
  adminId: z.string().min(1),
  adminName: z.string().max(100),
  userId: z.string().min(1),
});

// 6. VENUE

export const VenueSchema = z.object({
  venueId: z.string().min(1),
  venueName: z.string().max(100),
  capacity: z.number().int().positive(),
  address: z.string(),
  city: z.string().max(100),
  /** UI-level field: determines seat selection flow. Derived from seat records in real DB. */
  seatingType: z.enum(["reserved", "free"]).default("free").optional(),
});

// 7. SEAT

export const SeatSchema = z.object({
  seatId: z.string().min(1),
  section: z.string().max(50),
  seatNumber: z.string().max(10),
  rowNumber: z.string().max(10),
  venueId: z.string().min(1),
});

// 8. EVENT

export const EventSchema = z.object({
  eventId: z.string().min(1),
  eventDatetime: z.string(), // ISO-8601 string; convert to Date when querying real DB
  eventTitle: z.string().max(200),
  venueId: z.string().min(1),
  organizerId: z.string().min(1),
  /** Optional event description — not a DB column in the base schema; stored in mock layer. */
  description: z.string().optional(),
});

// 9. ARTIST

export const ArtistSchema = z.object({
  artistId: z.string().min(1),
  name: z.string().max(100),
  genre: z.string().max(100).nullable().optional(),
});

// 10. EVENT_ARTIST  (composite PK: eventId + artistId)

export const EventArtistSchema = z.object({
  eventId: z.string().min(1),
  artistId: z.string().min(1),
  role: z.string().max(100).nullable().optional(),
});

// 11. TICKET_CATEGORY

export const TicketCategorySchema = z.object({
  categoryId: z.string().min(1),
  categoryName: z.string().max(50),
  quota: z.number().int().positive(),
  price: z.number().nonnegative(),
  teventId: z.string().min(1), // FK → EVENT.event_id  (DB col: tevent_id)
});

// 12. TICKET

export const TicketSchema = z.object({
  ticketId: z.string().min(1),
  ticketCode: z.string().max(100),
  tcategoryId: z.string().min(1), // FK → TICKET_CATEGORY.category_id
  torderId: z.string().min(1), // FK → orders.order_id
});

// 13. HAS_RELATIONSHIP  (composite PK: seatId + ticketId)

export const HasRelationshipSchema = z.object({
  seatId: z.string().min(1),
  ticketId: z.string().min(1),
});

// 14. orders

export const PaymentStatusSchema = z.enum(["Pending", "Paid", "Cancelled"]);

export const OrderSchema = z.object({
  orderId: z.string().min(1),
  orderDate: z.string(), // ISO-8601 string
  paymentStatus: PaymentStatusSchema,
  totalAmount: z.number().nonnegative(),
  customerId: z.string().min(1),
});

// 15. PROMOTION

export const DiscountTypeSchema = z.enum(["NOMINAL", "PERCENTAGE"]);

export const PromotionSchema = z.object({
  promotionId: z.string().min(1),
  promoCode: z.string().max(50),
  discountType: DiscountTypeSchema,
  discountValue: z.number().positive(),
  startDate: z.string(), // ISO date string "YYYY-MM-DD"
  endDate: z.string(),
  usageLimit: z.number().int().positive(),
});

// 16. ORDER_PROMOTION

export const OrderPromotionSchema = z.object({
  orderPromotionId: z.string().min(1),
  promotionId: z.string().min(1),
  orderId: z.string().min(1),
});

// Inferred TypeScript types (use these everywhere instead of hand-written types)

export type UserAccount = z.infer<typeof UserAccountSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type AccountRole = z.infer<typeof AccountRoleSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Organizer = z.infer<typeof OrganizerSchema>;
export type Admin = z.infer<typeof AdminSchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type Seat = z.infer<typeof SeatSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Artist = z.infer<typeof ArtistSchema>;
export type EventArtist = z.infer<typeof EventArtistSchema>;
export type TicketCategory = z.infer<typeof TicketCategorySchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type HasRelationship = z.infer<typeof HasRelationshipSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type DiscountType = z.infer<typeof DiscountTypeSchema>;
export type Promotion = z.infer<typeof PromotionSchema>;
export type OrderPromotion = z.infer<typeof OrderPromotionSchema>;
