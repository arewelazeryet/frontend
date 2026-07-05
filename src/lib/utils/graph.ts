import type { ChartConfiguration } from "chart.js";
import type { AnnotationOptions } from "chartjs-plugin-annotation";
import type { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options";
import {
    aggregateByClientType,
    getTimestamps,
    type AggregateFieldUnion,
    type AggregateResponse,
    type Bucket,
} from "./types";

const milestones = [
    { date: "2024-01-29", label: "pp release" },
    { date: "2024-07-24", label: "daily challenges" },
    { date: "2024-10-09", label: "combo scaling removal" },
    { date: "2025-06-04", label: "song select v2" },
    { date: "2025-11-20", label: "updated download page" },
    { date: "2026-04-17", label: "ranked play" },
    { date: "2026-06-20", label: "mod multiplier changes" },
];

// Rosé Pine Dawn (light) / Rosé Pine (dark)
export function getColors() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dark
        ? {
              text: "#e0def4", // text
              grid: "#26233a", // overlay
              border: "#403d52", // highlight med
          }
        : {
              text: "#575279", // text
              grid: "#f2e9e1", // overlay
              border: "#dfdad9", // highlight med
          };
}

function getZoomOptions(is24h: boolean) {
    const colors = getColors();
    const zoomOptions: ZoomPluginOptions = {
        zoom: {
            drag: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderColor: colors.text,
                borderWidth: 0.25,
            },
            pinch: {
                enabled: true,
            },
            mode: "xy",
            onZoomComplete({ chart }) {
                if (!chart.options.scales?.x?.time) return;
                if (chart.isZoomedOrPanned()) {
                    chart.options.scales.x.time = {};
                } else {
                    chart.options.scales.x.time = {
                        unit: is24h ? "hour" : "month",
                    };
                }
                chart.update();
            },
        },
    };
    return zoomOptions;
}

const generateAnnotations = () => {
    const annotations: Record<string, AnnotationOptions> = {};
    const colors = getColors();
    for (const milestone of milestones) {
        annotations[`milestone_${milestone.date}`] = {
            type: "line",
            xMin: Date.parse(milestone.date),
            xMax: Date.parse(milestone.date),
            borderColor: "#88b30080",
            borderWidth: 1,
            label: {
                content: milestone.label,
                display: true,
                position: "end",
                color: colors.text,
                backgroundColor: colors.grid + "cc", // slight transparency
                borderColor: colors.border,
                borderWidth: 1,
                font: {
                    size: 10,
                    weight: "normal",
                },
            },
        };
    }

    return annotations;
};

export function makeUserRatioConfiguration(
    timestamps: number[],
    values: number[],
    name: string,
    is24h: boolean = false,
): ChartConfiguration {
    const colors = getColors();
    const chartTimestamps = timestamps.map((ts) => Math.floor(ts * 1000));

    return {
        type: "line",
        data: {
            labels: chartTimestamps,
            datasets: [
                {
                    label: "lazer%",
                    data: values,
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: true,
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: name,
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                annotation: {
                    annotations: is24h ? {} : generateAnnotations(),
                },
                zoom: getZoomOptions(is24h),
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        callback: (value) =>
                            (Number(value) / 100).toLocaleString("en-US", {
                                style: "percent",
                                maximumFractionDigits: 1,
                            }),
                    },
                },
                x: {
                    type: "timeseries",
                    time: {
                        unit: is24h ? "hour" : "month",
                    },
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: is24h ? 12 : 9,
                    },
                },
            },
        },
    };
}

export function makeUserCountConfiguration(
    timestamps: number[],
    stable: number[],
    lazer: number[],
    sum: number[],
    name: string,
    is24h: boolean = false,
): ChartConfiguration {
    const colors = getColors();
    const chartTimestamps = timestamps.map((ts) => Math.floor(ts * 1000));

    return {
        type: "line",
        data: {
            labels: chartTimestamps,
            datasets: [
                {
                    label: "stable",
                    data: stable,
                    borderColor: "#66ccff",
                    borderWidth: 2,
                },
                {
                    label: "lazer",
                    data: lazer,
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                },
                {
                    label: "total",
                    data: sum,
                    borderColor: "#6e6a86",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: true,
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 5,
                    hitRadius: 15,
                },
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: name,
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                tooltip: {
                    mode: "index",
                    position: "nearest",
                },
                annotation: {
                    annotations: is24h ? {} : generateAnnotations(),
                },
                zoom: getZoomOptions(is24h),
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20000,
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        callback: (value) =>
                            value.toLocaleString("en-US", {
                                maximumFractionDigits: 0,
                            }),
                    },
                },
                x: {
                    type: "timeseries",
                    time: {
                        unit: is24h ? "hour" : "month",
                    },
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: is24h ? 12 : 9,
                    },
                },
            },
        },
    };
}

export function maxLabelSize(field: AggregateFieldUnion) {
    switch (field) {
        case "unique_user_count":
            return undefined;
        case "unique_beatmap_count":
            return undefined;
        case "total_daily_scores":
            return 1000000;
        case "daily_scores_with_replays":
            return undefined;
        case "daily_perfect_combos":
            return undefined;
        case "daily_min_pp":
            return 1;
        case "daily_max_pp":
            return 2500;
        case "daily_sum_pp":
            return undefined;
        case "daily_sum_total_score":
            return undefined;
        case "daily_sum_classic_total_score":
            return undefined;
        case "daily_sum_legacy_total_score":
            return undefined;
        case "daily_max_classic_total_score":
            return undefined;
        case "daily_max_legacy_total_score":
            return undefined;
        case "daily_average_accuracy":
            return undefined;
        case "daily_peak_combo":
            return 25000;
    }
}

export function makeAggregateConfiguration(
    values: AggregateResponse[],
    ruleset: "osu" | "taiko" | "mania" | "catch" | "all",
    field: AggregateFieldUnion,
): ChartConfiguration {
    const colors = getColors();
    let filteredData: AggregateResponse[] = values;
    if (ruleset != "all") {
        filteredData = values.filter((entry) => entry.ruleset_id === ruleset);
    } else {
        filteredData = aggregateByClientType(values);
        console.log(filteredData[0], values[0]);
    }
    const chartTimestamps = getTimestamps(filteredData).map((ts) =>
        Math.floor(ts * 1000),
    );

    return {
        type: "bar",
        data: {
            labels: chartTimestamps,
            datasets: [
                {
                    label: "lazer",
                    data: filteredData
                        .filter((ts) => ts.client_type === "lazer")
                        .map((ts) => ts[field]),
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
                {
                    label: "stable",
                    data: filteredData
                        .filter((ts) => ts.client_type === "stable")
                        .map((ts) => ts[field]),
                    borderColor: "#66ccff",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: true,
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: field,
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                zoom: getZoomOptions(true),
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxLabelSize(field),
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                    },
                },
                x: {
                    type: "timeseries",
                    time: {
                        unit: "month",
                    },
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: 9,
                    },
                },
            },
        },
    };
}

export function makeBucketConfiguration(values: Bucket[]) {
    const colors = getColors();
    let filteredData: Bucket[] = values;
    return {
        type: "bar",
        data: {
            labels: filteredData.map((ts) => ts.bucket),
            datasets: [
                {
                    label: "lazer",
                    data: filteredData.map((ts) => ts.lazer),
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
                {
                    label: "stable",
                    data: filteredData.map((ts) => ts.stable),
                    borderColor: "#66ccff",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
                {
                    label: "both",
                    data: filteredData.map((ts) => ts.both),
                    borderColor: "#eeffcc",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 15,
                    pointHoverRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: true,
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: colors.text,
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                    },
                },
                title: {
                    display: true,
                    text: "User distribution per user ID bucket",
                    color: colors.text,
                    font: {
                        size: 18,
                        weight: "bold",
                    },
                },
                zoom: getZoomOptions(true),
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                        tickLength: 12,
                    },
                    ticks: {
                        color: colors.text,
                        padding: 5,
                    },
                },
                x: {
                    grid: {
                        color: colors.grid,
                        lineWidth: 2,
                        tickColor: colors.border,
                    },
                    ticks: {
                        autoSkip: false,
                        color: colors.text,
                        padding: 5,
                        maxRotation: 0,
                        maxTicksLimit: 9,
                    },
                },
            },
        },
    };
}
