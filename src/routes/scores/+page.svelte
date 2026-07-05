<script lang="ts">
    import AggregateChartBase from "$components/ScoreData/AggregateChartBase.svelte";
    import BucketChart from "$components/ScoreData/BucketChart.svelte";
    import BucketChartBase from "$components/ScoreData/BucketChartBase.svelte";
    import type { AggregateResponse, Bucket } from "$utils/types";

    let {
        data,
    }: { data: { aggregate: AggregateResponse[]; daily: Bucket[] } } = $props();

    let values = $derived(data.aggregate);
    let daily = $derived(data.daily);
</script>

<AggregateChartBase {values} />

<BucketChartBase values={daily} />
