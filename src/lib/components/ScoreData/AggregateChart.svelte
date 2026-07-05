<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        makeAggregateConfiguration,
        makeUserRatioConfiguration,
        maxLabelSize,
    } from "$lib/utils/graph.ts";

    import type { Chart as ChartType } from "chart.js";
    import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
    import {
        aggregateByClientType,
        getTimestamps,
        type AggregateFieldUnion,
        type AggregateResponse,
    } from "$lib/utils/types";

    let Chart: typeof ChartType;

    let {
        values,
        ruleset,
        field_name,
    }: {
        values: AggregateResponse[];
        ruleset: "osu" | "taiko" | "mania" | "catch" | "all";
        field_name: AggregateFieldUnion;
    } = $props();

    let chartCanvas: HTMLCanvasElement = $state();
    let graphChart: ChartType | undefined = $state();
    let resizeFrame: number | undefined;
    let lastWidth = 0;
    let mounted = $state(false);

    function createPlot() {
        if (!mounted || graphChart || !chartCanvas?.isConnected) {
            return;
        }

        lastWidth = chartCanvas.clientWidth;

        graphChart = new Chart(
            chartCanvas,
            makeAggregateConfiguration(values, ruleset, field_name),
        );
    }

    function handleDoubleclick() {
        graphChart?.resetZoom();
    }

    function recreatePlot() {
        if (!mounted) {
            return;
        }

        graphChart?.destroy();
        graphChart = undefined;
        createPlot();
    }

    function queueResize() {
        if (resizeFrame != null) {
            return;
        }

        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = undefined;

            if (!graphChart) {
                return;
            }

            const width = chartCanvas.clientWidth;
            if (width === 0 || width === lastWidth) {
                return;
            }

            lastWidth = width;
            graphChart.resize(width, 450);
        });
    }

    $effect(() => {
        if (graphChart) {
            graphChart.data.labels = getTimestamps(values).map((ts) =>
                Math.floor(ts * 1000),
            );

            graphChart.options.plugins.title.text = field_name;
            graphChart.options.scales.y.max = maxLabelSize(field_name);

            graphChart.data.datasets[0].data =
                ruleset === "all"
                    ? aggregateByClientType(values)
                          .filter((v) => v.client_type === "lazer")
                          .map((v) => v[field_name])
                    : values
                          .filter(
                              (v) =>
                                  v.ruleset_id === ruleset &&
                                  v.client_type === "lazer",
                          )
                          .map((v) => v[field_name]);
            graphChart.data.datasets[1].data =
                ruleset === "all"
                    ? aggregateByClientType(values)
                          .filter((v) => v.client_type === "stable")
                          .map((v) => v[field_name])
                    : values
                          .filter(
                              (v) =>
                                  v.ruleset_id === ruleset &&
                                  v.client_type === "stable",
                          )
                          .map((v) => v[field_name]);
            graphChart.update();
        }
    });

    onMount(() => {
        let isCancelled = false;

        let mediaQuery: MediaQueryList | undefined;
        let onSchemeChange: (() => void) | undefined;
        let ro: ResizeObserver | undefined;
        let io: IntersectionObserver | undefined;

        // dynamically import the modules on the client. zoom plugin will not work with ssr for example
        const initChart = async () => {
            const { Chart: ChartModule, registerables } =
                await import("chart.js");
            const annotationPlugin = (await import("chartjs-plugin-annotation"))
                .default;
            const zoomPlugin = (await import("chartjs-plugin-zoom")).default;

            if (isCancelled) return;

            Chart = ChartModule;
            Chart.register(...registerables, annotationPlugin, zoomPlugin);

            mounted = true;

            mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            onSchemeChange = recreatePlot;

            mediaQuery.addEventListener("change", onSchemeChange);

            ro = new ResizeObserver(queueResize);

            ro.observe(chartCanvas);

            io = new IntersectionObserver(
                ([entry]) => {
                    if (!entry?.isIntersecting) {
                        return;
                    }

                    createPlot();
                    io?.disconnect();
                },
                { rootMargin: "300px" },
            );

            io.observe(chartCanvas);
        };

        initChart();

        return () => {
            isCancelled = true;
            mounted = false;

            if (mediaQuery && onSchemeChange) {
                mediaQuery.removeEventListener("change", onSchemeChange);
            }

            io?.disconnect();
            ro?.disconnect();

            if (resizeFrame != null) {
                cancelAnimationFrame(resizeFrame);
            }
        };
    });

    onDestroy(() => {
        graphChart?.destroy();
        graphChart = undefined;
    });
</script>

<div style="height: 480px; padding: 15px 10px; width: 80%;">
    {#if !mounted}
        <span>Waiting for the chart to load...</span>
    {/if}
    <canvas bind:this={chartCanvas} ondblclick={handleDoubleclick}></canvas>
</div>
