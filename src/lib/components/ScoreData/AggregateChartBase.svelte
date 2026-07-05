<script lang="ts">
    import Segment from "$components/SegmentedControl/Segment.svelte";
    import SegmentedControl from "$components/SegmentedControl/SegmentedControl.svelte";
    import {
        AggregateFieldList,
        type AggregateResponse,
    } from "$lib/utils/types";
    import AggregateChart from "./AggregateChart.svelte";

    let { values } = $props();
    let ruleset: "osu" | "taiko" | "mania" | "catch" | "all" = $state("osu");

    let field_name: (typeof AggregateFieldList)[number] =
        $state("unique_user_count");
</script>

<div class="outer-box">
    <SegmentedControl value={ruleset} onChange={(v) => (ruleset = v)}>
        {#each ["osu", "taiko", "mania", "catch", "all"] as option}
            <Segment value={option}>{option}</Segment>
        {/each}
    </SegmentedControl>
    <select bind:value={field_name}>
        {#each AggregateFieldList as option}
            <option value={option}>{option}</option>
        {/each}
    </select>

    <AggregateChart {field_name} {ruleset} {values} />
</div>

<style>
    .outer-box {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>
