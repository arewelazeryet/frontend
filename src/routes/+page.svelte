<script lang="ts">
    import { invalidate } from "$app/navigation";
    import BarBlock from "$components/BarBlock.svelte";
    import Footer from "$components/Footer.svelte";
    import MilestoneList from "$components/MilestoneList.svelte";
    import { onMount } from "svelte";
    import GraphSet from "$components/GraphSet.svelte";
    import RatioEstimate from "$components/RatioEstimate.svelte";
    import { date } from "$utils/types.js";
    import SelfAnchor from "$components/SelfAnchor.svelte";
    import favicon from "../assets/favicon.ico";
    import SelectableGraphSet from "$components/SelectableGraphSet.svelte";

    let { data } = $props();

    const changelogs = $derived(data.changelogs);
    const peak = $derived(data.peak);
    const peakRel = $derived(data.peakRel);
    const nearPeak = $derived(data.nearPeak);
    const userCountData = $derived(data.userCountData);

    const historicCount = $derived(data.historicUserCount);

    onMount(() => {
        const interval = setInterval(() => {
            invalidate("app:home-view");
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    });
    const ratio = $derived(Math.round((changelogs?.ratio ?? 0) * 10000) / 100);

    const areWeYet = () => {
        if (ratio < 50.0) {
            return "not yet, but we're getting there";
        }
        if (ratio < 75.0) {
            return "the majority is here, but some still remain";
        }
        return "we are officially lazer";
    };

    const opengraphHeader = () => {
        const areWeYet =
            ratio < 50.0 ? "we are not lazer yet" : "we are lazer now";
        const start = `Currently the percentage is ${ratio}%. ${areWeYet}`;
        return start;
    };
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
    {#if changelogs}
        <meta property="og:description" content={opengraphHeader()} />
        <meta
            property="og:image"
            content="https://areweimageyet.chiffa.lol/signature.png"
        />
    {/if}
</svelte:head>

<div class="app">
    <div class="contents">
        <h1 style="margin-bottom: 0">are we lazer yet?</h1>
        <h2 style="margin-top: 0">{areWeYet()}</h2>
        <div class="bars">
            {#if changelogs}
                <BarBlock
                    anchor="current"
                    stable={changelogs.stable}
                    lazer={changelogs.lazer}
                    wrapped
                >
                    <h3 style="margin: 0;">
                        current user counts (as of {date(changelogs.timestamp)})
                    </h3>
                </BarBlock>
            {/if}
            <h2>Historic values</h2>
            {#if peak}
                <BarBlock
                    anchor="peak_user"
                    stable={peak.stable}
                    lazer={peak.lazer}
                >
                    highest lazer user count ({date(peak.timestamp)})
                </BarBlock>
                <BarBlock
                    anchor="peak_ratio"
                    stable={peakRel.stable}
                    lazer={peakRel.lazer}
                >
                    highest lazer ratio ({date(peakRel.timestamp)})
                </BarBlock>
                <BarBlock
                    anchor="percentile"
                    stable={nearPeak.stable}
                    lazer={nearPeak.lazer}
                >
                    highest usage while near peak ratio ({date(
                        nearPeak.timestamp,
                    )})
                </BarBlock>
            {/if}
        </div>
        <RatioEstimate />
        <div class="graphs">
            <GraphSet
                comparison={userCountData}
                comparison_name="user counts"
                ratio={userCountData}
                ratio_name="lazer user ratio"
                is24h={true}
            >
                <SelfAnchor anchor="24h">
                    <h2>24 hour data</h2>
                </SelfAnchor>
            </GraphSet>

            <SelectableGraphSet
                comparison={{
                    comparison_daily: historicCount.daily,
                    comparison_weekly: historicCount.weekly,
                }}
                comparison_name="historic user counts"
                ratio={{
                    ratio_daily: historicCount.daily,
                    ratio_weekly: historicCount.weekly,
                }}
                ratio_name="historic lazer%"
            >
                <SelfAnchor anchor="history">
                    <h2>historic data</h2>
                </SelfAnchor>
            </SelectableGraphSet>
        </div>
        <MilestoneList />
        <Footer />
    </div>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap");
    :global(*) {
        box-sizing: border-box;
        text-align: center;
    }

    :global(:root) {
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

    :global(body) {
        margin: 0;
        overflow-x: hidden;
    }

    h1 {
        text-align: center;
    }

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

    .bars {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .graphs {
        text-align: center;
    }

    @media (max-width: 1599px) {
        .contents {
            max-width: 700px;
        }
        .graphs {
            width: 100%;
        }
    }

    @media (min-width: 1600px) {
        .contents {
            max-width: 1400px;
        }
        .graphs {
            width: 1400px;
        }
    }

    input {
        appearance: none;
    }

    @media (prefers-color-scheme: light) {
        :root {
            background-color: #f6f6f6;
            color: black;
        }
    }
    @media (prefers-color-scheme: dark) {
        :root {
            background-color: #191724;
            color: #e0def4;
        }
    }
</style>
