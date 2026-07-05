<script lang="ts">
    import Segment from "$components/SegmentedControl/Segment.svelte";
    import SegmentedControl from "$components/SegmentedControl/SegmentedControl.svelte";
    import BucketChart from "./BucketChart.svelte";

    let { values } = $props();

    let buckets: "daily" | "weekly" | "monthly" = $state("daily");
    console.log(values);
</script>

<div class="outer-box">
    <SegmentedControl value={buckets} onChange={(v) => (buckets = v)}>
        {#each ["daily", "weekly", "monthly"] as option}
            <Segment value={option}>{option}</Segment>
        {/each}
    </SegmentedControl>
    <BucketChart values={values[buckets]} />
</div>

<style>
    .outer-box {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>
