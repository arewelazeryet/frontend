<script lang="ts">
    import ComparisonGraph from "$components/ComparisonGraph.svelte";
    import RatioGraph from "$components/RatioGraph.svelte";

    let {
        comparison,
        comparison_name,
        ratio,
        ratio_name,
        is24h,
        children,
    }: {
        comparison: {
            timestamp: number[];
            stable: number[];
            lazer: number[];
            sum: number[];
        };
        comparison_name: string;
        ratio: { timestamp: number[]; ratio: number[] };
        ratio_name: string;
        is24h?: boolean;
        children: any;
    } = $props();
</script>

<div class="children">
    {@render children()}
</div>
<div class="graph-box">
    <ComparisonGraph
        timestamps={comparison.timestamp}
        stable={comparison.stable}
        lazer={comparison.lazer}
        sum={comparison.sum}
        name={comparison_name}
        {is24h}
    />
    <RatioGraph
        timestamps={ratio.timestamp}
        values={ratio.ratio}
        name={ratio_name}
        {is24h}
    />
</div>

<style>
    .graph-box {
        display: flex;
    }
    @media (max-width: 600px) {
        .graph-box,
        .children {
            display: none;
        }
    }
    @media (max-width: 1599px) {
        .graph-box {
            flex-direction: column;
        }
    }

    @media (min-width: 1600px) {
        .graph-box {
            flex-direction: row;
        }
    }
</style>
