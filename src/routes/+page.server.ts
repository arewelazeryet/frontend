// src/routes/+page.server.ts
import { getHistoricRatio, getHistoricData } from "$lib/server/daily.server.ts";
import {
    getChangelogData,
    getLazerAbsolutePeak,
    getLazerPeakNearTopPercentage,
    getLazerRelativePeak,
    getUserCountGraph,
    getUserRatioGraph,
} from "../lib/server/stats.server.ts";
import { getLastDay, getLastDayRatio } from "$lib/server/last_day.ts";

export const load = async () => {
    const [
        changelogs,
        peak,
        peakRel,
        nearPeak,
        userCountData,
        userRatioData,
        dayUserCountData,
        dayUserRatioData,
        historicUserCount,
        historicUserRatio,
    ] = await Promise.all([
        getChangelogData(),
        getLazerAbsolutePeak(),
        getLazerRelativePeak(),
        getLazerPeakNearTopPercentage(),
        getUserCountGraph(),
        getUserRatioGraph(),
        getLastDay(),
        getLastDayRatio(),
        getHistoricData(),
        getHistoricRatio(),
    ]);

    return {
        changelogs,
        peak,
        peakRel,
        nearPeak,
        userCountData,
        userRatioData,
        dayUserCountData,
        dayUserRatioData,
        historicUserCount,
        historicUserRatio,
    };
};
