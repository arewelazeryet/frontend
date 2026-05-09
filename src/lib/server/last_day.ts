import { measurementsTable } from "$lib/db/schema";
import { ratio } from "$utils/data";
import { now } from "$utils/types";
import { desc } from "drizzle-orm";
import {
    type UserGraph,
    type RatioGraph,
    getDb,
    latestCheck,
} from "./stats.server";

let lastDayUserGraph: UserGraph | null = null;
let lastDayRatioGraph: RatioGraph | null = null;
let lastDayUpdatePromise: Promise<void> | null = null;
export async function updateLastDay() {
    const rows = (
        await getDb()
            .select()
            .from(measurementsTable)
            .orderBy(desc(measurementsTable.timestamp))
            .limit(288)
    )
        .reverse()
        .reduce(
            (acc, d) => {
                acc.timestamps.push(d.timestamp);
                acc.stable.push(d.stable ?? 0);
                acc.lazer.push(d.lazer ?? 0);
                acc.ratio.push(ratio(d.stable ?? 0, d.lazer ?? 0) * 100);
                acc.sum.push(d.stable + d.lazer);
                return acc;
            },
            {
                timestamps: [] as number[],
                stable: [] as number[],
                lazer: [] as number[],
                ratio: [] as number[],
                sum: [] as number[],
            },
        );

    lastDayUserGraph = {
        timestamps: rows.timestamps,
        stable: rows.stable,
        lazer: rows.lazer,
        sum: rows.sum,
    };
    lastDayRatioGraph = { timestamps: rows.timestamps, ratio: rows.ratio };
}
function isLastDayUpdated() {
    return lastDayUserGraph && lastDayRatioGraph && latestCheck > now() - 150;
}

async function ensureLastDayGraphs() {
    if (isLastDayUpdated()) {
        return;
    }

    lastDayUpdatePromise ??= updateLastDay().finally(() => {
        lastDayUpdatePromise = null;
    });

    await lastDayUpdatePromise;
}

export async function getLastDay(): Promise<UserGraph> {
    await ensureLastDayGraphs();
    return lastDayUserGraph!;
}

export async function getLastDayRatio(): Promise<RatioGraph> {
    await ensureLastDayGraphs();
    return lastDayRatioGraph!;
}
