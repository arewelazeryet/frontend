<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Chart as ChartType } from "chart.js";
    import type { Bucket } from "$lib/utils/types";
    import { makePieConfiguration } from "$utils/graph";

    let Chart: typeof ChartType;

    let {
        values,
    }: {
        values: Bucket[];
    } = $props();

    let chartCanvas: HTMLCanvasElement = $state();
    let graphChart: ChartType | undefined = $state();
    let mounted = $state(false);
    let value_list = $derived(values);

    function handleDoubleclick() {
        graphChart?.resetZoom();
    }

    function createPlot() {
        if (!mounted || graphChart || !chartCanvas?.isConnected) {
            return;
        }

        graphChart = new Chart(chartCanvas, makePieConfiguration(value_list));
    }

    $effect(() => {
        if (!graphChart) return;

        const totals = value_list.reduce(
            (acc, bucket) => {
                acc.lazer += bucket.lazer;
                acc.stable += bucket.stable;
                acc.both += bucket.both;
                return acc;
            },
            { lazer: 0, stable: 0, both: 0 },
        );

        graphChart.data.datasets[0].data = [
            totals.lazer,
            totals.stable,
            totals.both,
        ];

        graphChart.update();
    });

    onMount(() => {
        let cancelled = false;

        const init = async () => {
            const { Chart: ChartModule, registerables } =
                await import("chart.js");
            const zoomPlugin = (await import("chartjs-plugin-zoom")).default;
            const annotationPlugin = (await import("chartjs-plugin-annotation"))
                .default;

            if (cancelled) return;

            Chart = ChartModule;
            Chart.register(...registerables, zoomPlugin, annotationPlugin);

            mounted = true;
            createPlot();
        };

        init();

        return () => {
            cancelled = true;
        };
    });

    onDestroy(() => {
        graphChart?.destroy();
    });
</script>

<div style="height: 500px; width: 80%; padding: 15px;">
    {#if !mounted}
        <span>Waiting for the chart to load...</span>
    {/if}

    <canvas bind:this={chartCanvas} ondblclick={handleDoubleclick}></canvas>
</div>
