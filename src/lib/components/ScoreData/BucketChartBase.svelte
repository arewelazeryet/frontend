<script lang="ts">
    import Segment from "$components/SegmentedControl/Segment.svelte";
    import SegmentedControl from "$components/SegmentedControl/SegmentedControl.svelte";
    import BucketChart from "./BucketChart.svelte";
    import PieChart from "./PieChart.svelte";

    let { values } = $props();

    let buckets: "daily" | "weekly" | "monthly" = $state("daily");
</script>

<div class="outer-box">
    <SegmentedControl value={buckets} onChange={(v) => (buckets = v)}>
        {#each ["daily", "weekly", "monthly"] as option}
            <Segment value={option}>{option}</Segment>
        {/each}
    </SegmentedControl>
    <BucketChart values={values[buckets]} />
    <PieChart values={values[buckets]} />
</div>

<style>
    .outer-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
</style>
