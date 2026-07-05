import { getAggregates, getDaily } from "$lib/server/ushio.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, fetch, setHeaders }) => {
    return {
        aggregate: await getAggregates(fetch),
        daily: await getDaily(fetch),
    };
};
