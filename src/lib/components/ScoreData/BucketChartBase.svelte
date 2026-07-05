<script lang="ts">
    import BucketChart from "./BucketChart.svelte";

    let { values } = $props();
</script>

<div class="outer-box">
    <BucketChart {values} />
</div>

<style>
    .outer-box {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>
