import { integer, pgTable, uuid, varchar, text , timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users",{
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length:255}).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),
});

export const userSession = pgTable("user_session",{
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().references(() => userTable.id).notNull(), //if we write like uuid().unique() then it means that if the user is login fron the mobile it cannot login from laptop due to unique session , but we want that you can login from the multiple devices.
    createdAt: timestamp().defaultNow().notNull(),
});