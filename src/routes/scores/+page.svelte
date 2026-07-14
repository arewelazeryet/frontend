<script lang="ts">
    import Footer from "$components/Footer.svelte";
    import AggregateChartBase from "$components/ScoreData/AggregateChartBase.svelte";
    import BucketChart from "$components/ScoreData/BucketChart.svelte";
    import BucketChartBase from "$components/ScoreData/BucketChartBase.svelte";
    import PieChart from "$components/ScoreData/PieChart.svelte";
    import type { AggregateResponse, Bucket, BucketRaw } from "$utils/types";

    let {
        data,
    }: { data: { aggregate: AggregateResponse[]; daily: Bucket[] } } = $props();

    import favicon from "../../assets/favicon.ico";

    let values = $derived(data.aggregate);
    let daily = $derived(data);
</script>

<svelte:head>
    <!-- SEO -->
    <title>Are we lazer yet?</title>
    <meta
        name="description"
        content="are we lazer yet - osu!lazer user share tracker"
    />
    <link rel="canonical" href="https://arewelazeryet.chiffa.lol" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="index, follow" />
    <link rel="icon" href={favicon} />
    <meta
        name="google-site-verification"
        content="-1QvXnhPUOhjX9OFNWRLVbN3707RteA8NvI0fAvkh_U"
    />

    <!-- opengraph -->
    <meta
        property="og:title"
        content="arewelazeryet - osu!lazer user share tracker"
    />
    <meta property="og:type" content="website" />
</svelte:head>

<div class="app">
    <div class="box">
        <h3>Historical score data aggregation</h3>
        <AggregateChartBase {values} />
    </div>

    <div class="box">
        <h3>Player distribution</h3>
        <BucketChartBase values={daily} />
    </div>

    <div class="contents">
        <Footer />
    </div>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        overflow-y: scroll;
    }

    .contents {
        width: 100vw;
        padding: 10px;
    }

    .box {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
    }
    @media (max-width: 1599px) {
        .contents {
            max-width: 700px;
        }
    }

    @media (min-width: 1600px) {
        .contents {
            max-width: 1400px;
        }
    }

    h3 {
        width: fit-content;
    }
    :root {
        font-family: "Nunito Sans", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        line-height: 1.5;
        font-weight: 600;

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
    }
</style>
