<script lang="ts">
    import Milestone from "./Milestone.svelte";

    const reached = [
        { date: 1706562000000, milestone: "pp release" },
        { date: 1721854800000, milestone: "daily challenges" },
        { date: 1740430800000, milestone: "beatmap submission" },
        { date: 1749070800000, milestone: "song select v2" },
        { date: 1761685200000, milestone: "audio improvements" },
        { date: 1763683200000, milestone: "lazer default download" },
        { date: 1776459600000, milestone: "ranked play" },
    ];

    const tba = [
        { date: 1781740800000, milestone: "majority on lazer" },
        { date: null, milestone: "new score multipliers" },
        { date: null, milestone: "rates/mirror ranked" },
        { date: null, milestone: "results screen v2" },
        { date: null, milestone: "OWC on lazer" },
        { date: null, milestone: "app store release" },
        { date: null, milestone: "stable deprecated" },
    ];
</script>

<div>
    <h2>cool milestones</h2>
    <div class="card-container">
        {#each reached as _, i}
            <Milestone row={i + 1} date={reached[i].date} column="left"
                >{reached[i].milestone}</Milestone
            >
            <Milestone row={i + 1} date={tba[i].date} column="right"
                >{tba[i].milestone}</Milestone
            >
        {/each}
    </div>
</div>

<style>
    .card-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 1rem;
        row-gap: 1rem;
        max-width: 700px;
        margin: auto;
    }
</style>
