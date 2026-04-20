<script lang="ts">
    import Bars from "./Bars.svelte";

    let { lazer, stable, children } = $props();
</script>

<div class="bar">
    <h3>{@render children()}</h3>
    <Bars {stable} {lazer} />
</div>

<style>
    .bar {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h3 {
        margin: 0;
    }
</style>
