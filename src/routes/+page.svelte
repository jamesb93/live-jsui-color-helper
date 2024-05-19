<script lang='ts'>
	import { fly } from 'svelte/transition'
	import { rgba_to_hsla, rgba_to_hex, type RGBA } from '$lib/color'
	import colors from '$lib/data/colors.json'
	import Fuse from 'fuse.js'

	const themenames = Object.keys(colors[Object.keys(colors)[0]])

	const fuse = new Fuse(Object.keys(colors), {
		keys: ['tokenname'],
		threshold: 0.3
	})

	let viewables = Object.keys(colors);
	
	const output_formats = {
		hsla: (rgba: RGBA): string => {
			const hsla = rgba_to_hsla(rgba.colors)
			return `hsla(${hsla[0]}, ${hsla[1]*100}%, ${hsla[2]*100}%, ${hsla[3]})`
		},
		hex: (rgba: RGBA): string => rgba_to_hex(rgba.colors),
		rgba: (rgba: RGBA): string => `rgba(${rgba.colors[0]*255}, ${rgba.colors[1]*255}, ${rgba.colors[2]*255}, ${rgba.colors[3]})`,
		token: (rgba: RGBA): string => rgba.id
	}
	let format = Object.keys(output_formats)[0];

	let show_toast = false
	const copy = (rgba: RGBA) => {
		show_toast = false
		const output = output_formats[format](rgba)
		navigator.clipboard.writeText(output)
		// delay 3000 ms then hide toast
		show_toast = true
		setTimeout(() => show_toast = false, 3000)
	}

</script>
  
{#if show_toast}
<div class="toast" transition:fly={{ delay: 250, duration: 300, x: 100, opacity: 0.5 }}>
	<div>Copied!</div>
</div>
{/if}

<div class="format-options">
    {#each Object.keys(output_formats) as formatKey}
	<label>
		<input type="radio" bind:group={format} value={formatKey}>
		{formatKey.toUpperCase()}
	</label>
    {/each}
</div>

<div class="themenames">
	<div></div>
	{#each themenames as themename}
		<div class='themename'>{ themename }</div>
	{/each}
</div>

<div class="grid">
    {#each Object.entries(colors) as [tokenname, themes], i}
	<div class="token">
		{#if viewables.includes(tokenname)}
		<div class="tokenname">
			{ tokenname }
		</div>
		{#each themenames as themename}
			<button 
				class="colorsquare"
				style="background-color: rgba({themes[themename].colors[0]*255}, {themes[themename].colors[1]*255}, {themes[themename].colors[2]*255}, {themes[themename].colors[3]})"
				on:click={() => copy(themes[themename])}
			/>
		{/each}
		{/if}
	</div>
    {/each}
</div>
	
<style>
	.toast {
		position: fixed;
		top: 20px;
		right: 10px;
		padding: 1em;
		border: 1px solid black;
		background-color: white;	
	}
	#search {
		width: 100%;
	}
	.grid {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.token, .themenames {
		display: grid;
		grid-template-columns: 200px repeat(8, 150px);
		gap: 0.2em;
	}

	.tokenname, .themename {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.themenames {
		margin-bottom: 1em;
	}

	.colorsquare {
		width: 100px;
		height: 25px;
		outline: none;
		border: none;
	}

	.colorsquare:active {
		transform: translate(1px, 1px);
	}

	.colorsquare:hover { 
		cursor: copy; 
		outline: 1px solid blue;
	}

	.format-options {
		display: flex;
		gap: 1em;
		flex-direction: column;
	}
</style>

