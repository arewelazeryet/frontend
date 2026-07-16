<script lang="ts">
    import FooterLink from "../Footer/FooterLink.svelte";
    import { env } from "$env/dynamic/public";
</script>

<footer class="footer">
    <FooterLink url="/" title="users"
    ></FooterLink>
    <FooterLink url="/scores" title="scores"
    ></FooterLink>
</footer>

<style>
    .footer {
        display: flex;
        width: 50%;
        transform: translateX(50%);
        flex-direction: row;
        justify-content: space-around;
    }
    span {
        color: #6e6a86;
    }
</style>
