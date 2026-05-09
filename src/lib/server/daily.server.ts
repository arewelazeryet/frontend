import { dailyTable } from "$lib/db/schema";
import { ratio } from "$utils/data";
import { log } from "$utils/logs";
import type { NonZeroNumber } from "$utils/types";
import { getDb } from "./stats.server";

export type DailyEntry = {
    timestamps: number[];
    stable: number[];
    lazer: number[];
    sum: number[];
};

export type DailyRatio = {
    timestamps: number[];
    ratio: number[];
};

let latestCheckedDay: Date = new Date(Date.now());

function isLatestCheckToday() {
    const today = new Date(Date.now());

    return latestCheckedDay.getDate() === today.getDate();
}

let latestHistoricAbsolute: DailyEntry;
let latestHistoricRatio: DailyRatio;
let historicUpdatePromise: Promise<void> | null = null;

function isHistoricFresh() {
    return (
        isLatestCheckToday() && latestHistoricAbsolute && latestHistoricRatio
    );
}

async function ensureHistoricData() {
    if (isHistoricFresh()) {
        return;
    }
    historicUpdatePromise ??= updateHistoricData().finally(() => {
        historicUpdatePromise = null;
    });
    await historicUpdatePromise;
}
export async function getHistoricData(): Promise<DailyEntry> {
    await ensureHistoricData();
    return latestHistoricAbsolute!;
}
export async function getHistoricRatio(): Promise<DailyRatio> {
    await ensureHistoricData();
    return latestHistoricRatio!;
}

export async function updateHistoricData(): Promise<void> {
    latestCheckedDay = new Date(Date.now());

    const db = getDb();

    let values = (await db.select().from(dailyTable)).reduce(
        (init, value) => {
            init.timestamps.push(value.date);
            init.stable.push(value.stable);
            init.lazer.push(value.lazer);
            init.sum.push(value.stable + value.lazer);
            init.ratio.push(ratio(value.stable, value.lazer) * 100);
            return init;
        },
        {
            timestamps: [] as number[],
            stable: [] as number[],
            lazer: [] as number[],
            ratio: [] as number[],
            sum: [] as number[],
        },
    );

    latestHistoricAbsolute = {
        timestamps: values.timestamps,
        stable: values.stable,
        lazer: values.lazer,
        sum: values.sum,
    };

    latestHistoricRatio = {
        timestamps: values.timestamps,
        ratio: values.ratio,
    };

    return;
}
