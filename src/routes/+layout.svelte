<script lang="ts">
    import Footer from '$components/Navs/Footer/Footer.svelte';
    import Header from '$components/Navs/Header/Header.svelte';

    let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />

<style>
    @media (prefers-color-scheme: light) {
        :root {
            background-color: #f6f6f6;
            color: black;
        }
    }
    @media (prefers-color-scheme: dark) {
        :root {
            background-color: #191724;
            color: #e0def4;
        }
    }
</style>
