import type { ChartConfiguration } from "chart.js";
import type uPlot from "uplot";

export const dateTimeSettings = [
    [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
    [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
    [3600 * 24, "{D}/{M}", "\n{YYYY}", null, null, null, null, null, 1],
    [3600, "{h}{aa}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
    [60, "{h}:{mm}{aa}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
    [1, ":{ss}", "\n{D}/{M}/{YY} {h}:{mm}{aa}", null, "\n{D}/{M} {h}:{mm}{aa}", null, "\n{h}:{mm}{aa}", null, 1],
    [0.001, ":{ss}.{fff}", "\n{D}/{M}/{YY} {h}:{mm}{aa}", null, "\n{D}/{M} {h}:{mm}{aa}", null, "\n{h}:{mm}{aa}", null, 1],
];

const milestones = [
    { date: "2024-01-29", label: "pp release" },
    { date: "2024-07-24", label: "daily challenges" },
    { date: "2025-06-04", label: "song select v2" },
    { date: "2025-11-20", label: "updated download page" },
    { date: "2026-04-17", label: "ranked play" },
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

const getChartDates = (timestamps: number[]) => timestamps.map((ts) => new Date(ts * 1000));
const getDateIndex = (dates: Date[], dateStr: string) => {
    return dates.findIndex((d) => d.toISOString().startsWith(dateStr));
};

const generateAnnotations = (dates: Date[]) => {
    const annotations: Record<string, any> = {};
    for (const milestone of milestones) {
        const index = getDateIndex(dates, milestone.date);
        if (index !== -1) {
            annotations[`milestone${index}`] = {
                type: "line",
                xMin: index,
                xMax: index,
                borderColor: "#88b30080",
                borderWidth: 1,
                label: {
                    content: milestone.label,
                    display: true,
                    position: "end",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    font: {
                        size: 10,
                        weight: "normal",
                    },
                },
            };
        }
    }
    return annotations;
};

export function makeUserRatioConfiguration(
    timestamps: number[],
    values: number[],
    name: string,
    is24h: Boolean = false,
): ChartConfiguration {
    const colors = getColors();
    const chartDates = getChartDates(timestamps);

    const tickDateOptions = is24h
        ? {
              yeah: undefined,
              month: undefined,
              day: undefined,
              hour: "numeric",
          }
        : {
              month: "short",
              year: "numeric",
              day: undefined,
              weekday: undefined,
          };

    return {
        type: "line",
        data: {
            labels: chartDates,
            datasets: [
                {
                    label: "lazer%",
                    data: values,
                    borderColor: "#ff66aa",
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "nearest",
                intersect: false,
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
                    callbacks: {
                        title: (context) => {
                            return chartDates[context[0].dataIndex].toLocaleString("en-US");
                        },
                    },
                },
                annotation: {
                    annotations: generateAnnotations(chartDates),
                },
                zoom: {
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: "x",
                    },
                },
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
                        callback: (value) => `${value}%`,
                    },
                },
                x: {
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
                        callback: (_value, index) => {
                            return chartDates[index].toLocaleString("en-US", tickDateOptions);
                        },
                    },
                },
            },
        },
    };
}

export function makeUserCountOptions(width: number, id: string, title: string): uPlot.Options {
    const c = getColors();

    return {
        title: title,
        id: id,
        width: width,
        height: 380,
        scales: {
            y: { min: 0, max: 20000 },
        },
        series: [
            { label: "time" },
            { label: "stable", stroke: "#66ccff", width: 2, spanGaps: false },
            { label: "lazer", stroke: "#ff66aa", width: 2, spanGaps: false },
            { label: "total", stroke: "#6e6a86", width: 2, spanGaps: false },
        ],
        axes: [
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: dateTimeSettings,
            },
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
            },
        ],
    };
}

export function makeUserRatioOptions(width: number, id: string, title: string): uPlot.Options {
    const c = getColors();

    return {
        title: title,
        id: id,
        width: width,
        height: 380,
        scales: {
            y: { min: 0, max: 100 },
        },
        series: [{ label: "time" }, { label: "lazer%", stroke: "#ff66aa", width: 2 }],
        axes: [
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: dateTimeSettings,
            },
            {
                stroke: c.text,
                grid: { stroke: c.grid },
                ticks: { stroke: c.border },
                values: (_u, vals) => vals.map((v) => (v != null ? `${v.toFixed(1)}%` : "")),
            },
        ],
    };
}
