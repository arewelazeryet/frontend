<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Chart as ChartType } from "chart.js";
    import type { Bucket } from "$lib/utils/types";
    import { makeBucketConfiguration } from "$utils/graph";

    let Chart: typeof ChartType;

    let {
        values,
    }: {
        values: Bucket[];
    } = $props();

    let chartCanvas: HTMLCanvasElement = $state();
    let graphChart: ChartType | undefined = $state();
    let mounted = $state(false);

    function createPlot() {
        if (!mounted || graphChart || !chartCanvas?.isConnected) {
            return;
        }

        // What's wrong with you idiot
        graphChart = new Chart(chartCanvas, makeBucketConfiguration(values));
    }

    $effect(() => {
        if (!graphChart) return;

        graphChart.data.labels = values.map((v) => v.bucket);

        graphChart.data.datasets[0].data = values.map((v) => v.lazer);
        graphChart.data.datasets[1].data = values.map((v) => v.stable);
        graphChart.data.datasets[2].data = values.map((v) => v.both);

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

    <canvas bind:this={chartCanvas}></canvas>
</div>
