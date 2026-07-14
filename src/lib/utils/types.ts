declare const nonZeroNumberBrand: unique symbol;
export type NonZeroNumber = number & { [nonZeroNumberBrand]: void };

export function nonZeroNumber(value: number): NonZeroNumber | undefined {
    if (value === 0) {
        return undefined;
    }

    return value as unknown as NonZeroNumber;
}

export function now(): NonZeroNumber {
    return nonZeroNumber(Math.round(Date.now() / 1000)) as NonZeroNumber;
}

export function date(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString("en-UK", {
        timeZone: "UTC",
    });
}

export function dateOnly(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString("en-UK", {
        timeZone: "UTC",
    });
}

export type BucketRaw = {
    stable: number;
    lazer: number;
    both: number;
    bucket: number;
};

export type Bucket = {
    stable: number;
    lazer: number;
    both: number;
    bucket: string;
};

export function toReadable(raw: BucketRaw): Bucket {
    return {
        ...raw,
        bucket: `${raw.bucket / 1000000}M - ${raw.bucket / 1000000 + 2}M`,
    };
}

/// Raw response type without data casting
export type AggregateResponseRaw = {
    // Day timestamp
    day_bucket: number;
    // Ruleset ID stringified
    ruleset_id: "osu" | "taiko" | "mania" | "catch";
    // Client type stringified
    client_type: "stable" | "lazer";

    unique_user_count: number;
    unique_beatmap_count: number;

    total_daily_scores: number;
    daily_scores_with_replays: number;
    daily_perfect_combos: number;

    daily_min_pp: number;
    daily_max_pp: number;
    daily_sum_pp: number;

    daily_sum_total_score: string;
    daily_sum_classic_total_score: string;
    daily_sum_legacy_total_score: string;
    daily_max_classic_total_score: number;
    daily_max_legacy_total_score: number;
    daily_average_accuracy: number;
    daily_peak_combo: number;
};

export const AggregateFieldList = [
    "unique_user_count",
    "unique_beatmap_count",
    "total_daily_scores",
    "daily_scores_with_replays",
    "daily_perfect_combos",
    "daily_min_pp",
    "daily_max_pp",
    "daily_sum_pp",
    "daily_sum_total_score",
    "daily_sum_classic_total_score",
    "daily_max_classic_total_score",
    "daily_average_accuracy",
    "daily_peak_combo",
] as const;

export const HumanizedFieldList = {
    unique_user_count: "Unique user count",
    unique_beatmap_count: "Unique played beatmap count",
    total_daily_scores: "Total submitted scores",
    daily_scores_with_replays: "Total scores with replays",
    daily_perfect_combos: "Scores with perfect combo",
    daily_min_pp: "Minimum pp",
    daily_max_pp: "Maximum pp",
    daily_sum_pp: "Total sum of pp",
    daily_sum_total_score: "Total score sum",
    daily_sum_classic_total_score: "Classic total score sum",
    daily_max_classic_total_score: "Max classic total score",
    daily_average_accuracy: "Average accuracy",
    daily_peak_combo: "Peak combo",
};

export type AggregateFieldUnion = (typeof AggregateFieldList)[number];

export type AggregateFields = Record<
    (typeof AggregateFieldList)[number],
    number
>;

export type AggregateResponse = {
    // Day timestamp
    day_bucket: number;
    // Ruleset ID stringified
    ruleset_id: "osu" | "taiko" | "mania" | "catch";
    // Client type stringified
    client_type: "stable" | "lazer";
} & AggregateFields;

export function aggregateByClientType(
    rows: AggregateResponse[],
): AggregateResponse[] {
    const grouped = new Map<string, AggregateResponse>();

    for (const row of rows) {
        const key = `${row.day_bucket}:${row.client_type}`;

        const existing = grouped.get(key);

        if (!existing) {
            grouped.set(key, { ...row });
            continue;
        }

        for (const field of AggregateFieldList) {
            existing[field] += row[field];
        }
    }

    return [...grouped.values()];
}

export function getTimestamps(rows: AggregateResponse[]) {
    return [...new Set(rows.map((r) => r.day_bucket))];
}

export function fromRaw(raw: AggregateResponseRaw): AggregateResponse {
    return {
        ...raw,
        daily_sum_total_score: Number.parseInt(raw.daily_sum_total_score),
        daily_sum_classic_total_score: Number.parseInt(
            raw.daily_sum_classic_total_score,
        ),
    };
}
