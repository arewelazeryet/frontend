<script lang="ts">
    import Segment from "$components/SegmentedControl/Segment.svelte";
    import SegmentedControl from "$components/SegmentedControl/SegmentedControl.svelte";
    import {
        AggregateFieldList,
        HumanizedFieldList,
        type AggregateResponse,
    } from "$lib/utils/types";
    import AggregateChart from "./AggregateChart.svelte";

    let { values } = $props();
    let ruleset: "osu" | "taiko" | "mania" | "catch" | "all" = $state("osu");

    let field_name: (typeof AggregateFieldList)[number] =
        $state("unique_user_count");
</script>

<div class="outer-box">
    <div class="inner-box">
        <SegmentedControl value={ruleset} onChange={(v) => (ruleset = v)}>
            {#each ["osu", "taiko", "mania", "catch", "all"] as option}
                <Segment value={option}>{option}</Segment>
            {/each}
        </SegmentedControl>
        <select bind:value={field_name}>
            {#each AggregateFieldList as option}
                <option value={option}>{HumanizedFieldList[option]}</option>
            {/each}
        </select>
    </div>

    <AggregateChart
        humanized_field_name={HumanizedFieldList[field_name]}
        {field_name}
        {ruleset}
        {values}
    />
</div>

<style>
    .outer-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    select {
        height: 100%;
        border-radius: 8px;

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

    @media (prefers-color-scheme: dark) {
        select {
            background: #26233a;
            border: 3px solid #21202e;
            color: #e0def4;
            color-scheme: dark;
        }
    }
    @media (prefers-color-scheme: light) {
        select {
            background: #faf4ed;
            border-color: #f4ede8;
            color: #464261;
            color-scheme: light;
        }
    }
</style>
