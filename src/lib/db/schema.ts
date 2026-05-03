import { sqliteTable } from "drizzle-orm/sqlite-core/table";
import { index, int, uniqueIndex } from "drizzle-orm/sqlite-core";

export const measurementsTable = sqliteTable(
    "measurements",
    {
        timestamp: int().primaryKey({ autoIncrement: false }),
        stable: int().notNull(),
        lazer: int().notNull(),
    },
    (table) => [
        uniqueIndex("idx_timestamp").on(
            table.timestamp,
            table.stable,
            table.lazer,
        ),
    ],
);

export const dailyTable = sqliteTable(
    "daily",
    {
        date: int().primaryKey({ autoIncrement: false }),
        stable: int().notNull(),
        lazer: int().notNull(),
    },
    (table) => [
        uniqueIndex("idx_date").on(table.date, table.stable, table.lazer),
    ],
);
