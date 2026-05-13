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
        "majority on lazer",
        "new score multipliers",
        "rates/mirror ranked",
        "results screen v2",
        "OWC on lazer",
        "app store release",
        "stable deprecated",
    ];
</script>

<div>
    <h2>cool milestones</h2>
    <div class="card-container">
        {#each reached as _, i}
            <Milestone row={i + 1} date={reached[i].date}
                >{reached[i].milestone}</Milestone
            >
            <Milestone row={i + 1} date={null}>{tba[i]}</Milestone>
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
