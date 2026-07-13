import { env } from "$env/dynamic/private";
import {
    type AggregateResponseRaw,
    fromRaw,
    type AggregateResponse,
    type BucketRaw,
    toReadable,
    type Bucket,
} from "$utils/types";
import { getJson, type LoadFetch } from "./backend.server";

const USHIO = env._USHIO ?? "http://127.0.0.1:7727";

export async function getAggregates(
    fetch: LoadFetch,
): Promise<AggregateResponse[]> {
    return await getJson<AggregateResponseRaw[]>(fetch, USHIO, "/api/aggregate")
        .then((d) => d.map(fromRaw))
        .then((r) => r.sort((a, b) => a.day_bucket - b.day_bucket));
}

export async function getDaily(fetch: LoadFetch): Promise<Bucket[]> {
    return await getJson<BucketRaw[]>(
        fetch,
        USHIO,
        "/api/distribution/daily",
    ).then((b) => b.map(toReadable));
}
export async function getWeekly(fetch: LoadFetch): Promise<Bucket[]> {
    return await getJson<BucketRaw[]>(
        fetch,
        USHIO,
        "/api/distribution/weekly",
    ).then((b) => b.map(toReadable));
}
export async function getMonthly(fetch: LoadFetch): Promise<Bucket[]> {
    return await getJson<BucketRaw[]>(
        fetch,
        USHIO,
        "/api/distribution/monthly",
    ).then((b) => b.map(toReadable));
}
