<script lang="ts">
    import { setContext } from "svelte";
    let { value, onChange, children } = $props();

    // local reactive state synced with prop
    let selected = $derived(value);

    // keep internal state in sync if parent changes `value`
    $effect(() => {
        selected = value;
    });

    function select(v: string) {
        if (v === selected) return;
        selected = v;
        onChange(v);
    }

    setContext("segmented-control", {
        get selected() {
            return selected;
        },
        select,
    });
</script>

<div class="segmented-control" role="tablist">
    {@render children()}
</div>

<style>
    .segmented-control {
        display: inline-flex;
        width: fit-content;
        background: light-dark(#1f1d2e, #fffaf3);
        color: light-dark(#e0def4, #575279);
        border-radius: 8px;
        padding: 4px;
        gap: 4px;
    }
</style>
