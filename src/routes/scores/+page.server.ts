import {
    getAggregates,
    getDaily,
    getMonthly,
    getWeekly,
} from "$lib/server/ushio.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, fetch, setHeaders }) => {
    const [aggregates, daily, weekly, monthly] = await Promise.all([
        getAggregates(fetch),
        getDaily(fetch),
        getWeekly(fetch),
        getMonthly(fetch),
    ]);
    return {
        aggregate: aggregates,
        daily: daily,
        weekly: weekly,
        monthly: monthly,
    };
};
