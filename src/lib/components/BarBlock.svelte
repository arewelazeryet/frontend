<script lang="ts">
    import type { Snippet } from "svelte";
    import Bars from "./Bars.svelte";
    import SelfAnchor from "./SelfAnchor.svelte";

    let {
        lazer,
        stable,
        anchor,
        wrapped,
        children,
    }: {
        lazer: any;
        stable: any;
        anchor: any;
        wrapped?: any;
        children: Snippet;
    } = $props();
</script>

<div class="bar">
    <SelfAnchor {anchor}>
        {#if wrapped !== null}
            <h3>
                {@render children()}
            </h3>
        {:else}
            {@render children()}
        {/if}
    </SelfAnchor>
    <Bars {stable} {lazer} />
</div>

<style>
    .bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: auto;
    }
    h3 {
        margin: 0;
        width: 100%;
    }
</style>
