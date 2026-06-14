import { env } from "$env/dynamic/private";

const Url = env._URL ?? "http://127.0.0.1:6726";

export const VIEW_DEPENDENCY = "app:home-view";
export const VIEW_CACHE_CONTROL =
    "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

export type SinglePointResponse = {
    timestamp: number;
    stable: number;
    lazer: number;
    sum: number;
    ratio: number;
};

export type PointLineResponse = {
    timestamp: number[];
    stable: number[];
    lazer: number[];
    sum: number[];
    ratio: number[];
};

export type RegressionResult = {
    target_ratio: number;
    was_reached: boolean;
    estimated_timestamp: number;
};

type LoadFetch = typeof fetch;

async function getJson<T>(fetch: LoadFetch, path: string): Promise<T> {
    const response = await fetch(`${Url}${path}`);

    if (!response.ok) {
        throw new Error(` request failed: ${path} ${response.status}`);
    }

    return response.json() as Promise<T>;
}

function normalizeSinglePoint(
    response: SinglePointResponse,
): SinglePointResponse {
    return {
        ...response,
    };
}

function normalizePointLine(response: PointLineResponse): PointLineResponse {
    return {
        ...response,
        ratio: response.ratio.map((ratio) => ratio * 100),
    };
}

export async function getCurrent(fetch: LoadFetch) {
    return normalizeSinglePoint(
        await getJson<SinglePointResponse>(fetch, "/api/bars/current"),
    );
}

export async function getPeakUsers(fetch: LoadFetch) {
    return normalizeSinglePoint(
        await getJson<SinglePointResponse>(fetch, "/api/bars/peak_users"),
    );
}

export async function getPeakRatio(fetch: LoadFetch) {
    return normalizeSinglePoint(
        await getJson<SinglePointResponse>(fetch, "/api/bars/peak_ratio"),
    );
}

export async function getPeakPercentile(fetch: LoadFetch) {
    return normalizeSinglePoint(
        await getJson<SinglePointResponse>(fetch, "/api/bars/peak_percentile"),
    );
}

export async function getDayGraph(fetch: LoadFetch) {
    return normalizePointLine(
        await getJson<PointLineResponse>(fetch, "/api/graphs/day"),
    );
}

export async function getHistoryGraph(fetch: LoadFetch) {
    return normalizePointLine(
        await getJson<PointLineResponse>(fetch, "/api/graphs/history"),
    );
}

/// A bit dirty but requires Redis to clean up so I cba yet
export async function getHistoryGraphWeekly(fetch: LoadFetch) {
    return normalizePointLine(
        await getJson<PointLineResponse>(
            fetch,
            "/api/graphs/history?bucket_size=Week",
        ),
    );
}
export async function getRatioEstimate(fetch: LoadFetch, percentage: number) {
    return getJson<RegressionResult>(
        fetch,
        `/api/graphs/ratio_estimate/${percentage}`,
    );
}

export async function getHomeView(fetch: LoadFetch) {
    const [
        changelogs,
        peak,
        peakRel,
        nearPeak,
        dayGraph,
        historyGraph,
        historyGraphWeekly,
    ] = await Promise.all([
        getCurrent(fetch),
        getPeakUsers(fetch),
        getPeakRatio(fetch),
        getPeakPercentile(fetch),
        getDayGraph(fetch),
        getHistoryGraph(fetch),
        getHistoryGraphWeekly(fetch),
    ]);

    return {
        changelogs,
        peak,
        peakRel,
        nearPeak,
        userCountData: dayGraph,
        historicUserCount: {
            daily: historyGraph,
            weekly: historyGraphWeekly,
        },
    };
}
