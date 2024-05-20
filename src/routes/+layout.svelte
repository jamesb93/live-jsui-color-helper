<script>
	import '../app.css'
	import "carbon-components-svelte/css/all.css";
</script>

<main>
	<slot></slot>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>