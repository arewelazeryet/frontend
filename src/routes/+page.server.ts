// src/routes/+page.server.ts
import { getHistoricData, getHistoricRatio } from "$lib/server/daily.server.ts";
import {
    getChangelogData,
    getLastDay,
    getLastDayRatio,
    getLazerAbsolutePeak,
    getLazerPeakNearTopPercentage,
    getLazerRelativePeak,
    getUserCountGraph,
    getUserRatioGraph,
} from "../lib/server/stats.server.ts";

export const load = async () => {
    return {
        changelogs: await getChangelogData(),
        peak: await getLazerAbsolutePeak(),
        peakRel: await getLazerRelativePeak(),
        nearPeak: await getLazerPeakNearTopPercentage(),
        userCountData: await getUserCountGraph(),
        userRatioData: await getUserRatioGraph(),
        dayUserCountData: await getLastDay(),
        dayUserRatioData: await getLastDayRatio(),
        historicUserCount: await getHistoricData(),
        historicUserRatio: await getHistoricRatio(),
    };
};
