import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** کاربران: متقاضی، کارشناس، مدیر */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("applicant"), // applicant | expert | admin
  city: text("city"),
  passportNo: text("passport_no"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** کاتالوگ خدمات (مهاجرتی، مالی، ملکی، درمانی و ...) */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleFa: text("title_fa").notNull(),
  titleEn: text("title_en").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull().default("🛠️"),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  priceFromEur: integer("price_from_eur").notNull().default(0),
  durationLabel: text("duration_label").notNull().default("—"),
  successRate: integer("success_rate").notNull().default(90),
  popularity: integer("popularity").notNull().default(50),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** پرونده‌های مهاجرتی */
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  userId: integer("user_id").notNull(),
  serviceId: integer("service_id"),
  serviceTitle: text("service_title").notNull(),
  expertId: integer("expert_id"),
  stage: integer("stage").notNull().default(1),
  progress: integer("progress").notNull().default(10),
  priority: text("priority").notNull().default("normal"),
  successScore: integer("success_score").notNull().default(70),
  status: text("status").notNull().default("active"), // active | waiting | closed
  estimatedDays: integer("estimated_days").notNull().default(90),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** رویدادهای تایم‌لاین پرونده */
export const caseEvents = pgTable("case_events", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  title: text("title").notNull(),
  note: text("note"),
  stage: integer("stage").notNull().default(1),
  kind: text("kind").notNull().default("status"), // status | doc | payment | ai | note
  author: text("author").notNull().default("سامانه"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** مدارک پرونده */
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull().default("عمومی"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** پیام‌رسان داخلی متقاضی ↔ کارشناس */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  authorRole: text("author_role").notNull().default("applicant"), // applicant | expert | system
  authorName: text("author_name").notNull().default("متقاضی"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** درخواست مشاوره / سرنخ فروش */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceSlug: text("service_slug"),
  city: text("city"),
  message: text("message"),
  status: text("status").notNull().default("new"), // new | contacted | converted
  score: integer("score").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** نتایج ارزیابی هوشمند شانس موفقیت */
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  fullName: text("full_name"),
  phone: text("phone"),
  inputs: jsonb("inputs").$type<Record<string, string>>().notNull(),
  score: integer("score").notNull(),
  verdict: text("verdict").notNull(),
  paths: jsonb("paths").$type<unknown[]>().notNull().default([]),
  risks: jsonb("risks").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** فاکتورها و پرداخت‌ها */
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  title: text("title").notNull(),
  amountEur: integer("amount_eur").notNull().default(0),
  amountToman: bigint("amount_toman", { mode: "number" }).notNull().default(0),
  status: text("status").notNull().default("unpaid"), // unpaid | paid | installment
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** اخبار، آکادمی و کامیونیتی */
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("news"), // news | academy | community | market
  tag: text("tag").notNull().default("مجارستان"),
  readMinutes: integer("read_minutes").notNull().default(4),
  coverEmoji: text("cover_emoji").notNull().default("📰"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

/** پایگاه دانش دستیار هوشمند */
export const knowledge = pgTable("knowledge", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  category: text("category").notNull().default("عمومی"),
});

export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type CaseRow = typeof cases.$inferSelect;
export type CaseEvent = typeof caseEvents.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type KnowledgeRow = typeof knowledge.$inferSelect;
