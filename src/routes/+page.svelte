<script lang='ts'>
	import { CodeSnippet, Search } from "carbon-components-svelte";
	import { type RGBA } from '$lib/color'
	import colors from '$lib/data/colors.json'
	import Fuse from 'fuse.js'
	import * as d3 from 'd3';
	import * as hsv from 'd3-hsv';

	const themenames = Object.keys(colors[Object.keys(colors)[0]])

	const fuse = new Fuse(Object.keys(colors), {
		keys: ['tokenname'],
		threshold: 0.3
	})

	const truncate_floats = (values: number[], precision: number = 2): number[] => {
    	return values.map(value => Number(value.toFixed(precision)));
	}
	
	const output_formats = [
		{
			name: 'token',
			transformer: (rgba: RGBA): string => rgba.id
		},
		{
			name: 'hex',
			transformer: (rgba: RGBA): string => {
				const rgba_truncated = truncate_floats(rgba.colors, 3)
					.map(value => value * 255);
				const rgba_color = d3.rgb(...rgba_truncated);
				return rgba_color.formatHex();
			}
		},
		{ 
			name: 'rgba 255',
			transformer: (rgba: RGBA): string => {
				const mapped = rgba.colors.map((value: number) => value * 255)
				const rgba_truncated = truncate_floats(mapped, 2)
				return `rgba(${rgba_truncated[0]}, ${rgba_truncated[1]}, ${rgba_truncated[2]}, ${rgba_truncated[3]})`
			}
				
		},
		{ 
			name: 'rgba 0..1',
			transformer: (rgba: RGBA): string => {
				const rgba_truncated = truncate_floats(rgba.colors, 2)
				return `rgba(${rgba_truncated[0]}, ${rgba_truncated[1]}, ${rgba_truncated[2]}, ${rgba_truncated[3]})`
			}
				
		},
		{
			name: 'hsla',
			transformer: (rgba: RGBA): string => {
				const rgba_truncated = truncate_floats(rgba.colors, 3)
					.map(value => value * 255);
				const rgba_color = d3.rgb(...rgba_truncated);
				const hsla = d3.hsl(rgba_color);
				hsla.h = isNaN(hsla.h) ? 0 : hsla.h;
				hsla.s = isNaN(hsla.s) ? 0 : hsla.s;
				hsla.l = isNaN(hsla.l) ? 0 : hsla.l;

				hsla.h = Math.round(hsla.h);
				hsla.s = Math.round(hsla.s * 100.0);
				hsla.l = Math.round(hsla.l * 100.0);

				return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${rgba.colors[3]})`;
			},
		},
		{
			name: 'hsv',
			transformer: (rgba: RBGA): string => {
				const rgba_truncated = truncate_floats(rgba.colors, 3).map(value => value * 255)
				const rgba_color = d3.rgb(...rgba_truncated)
				const hsv_color = hsv.hsv(rgba_color)
				hsv_color.h = isNaN(hsv_color.h) ? 0 : hsv_color.h
				hsv_color.s = isNaN(hsv_color.s) ? 0 : hsv_color.s
				hsv_color.v = isNaN(hsv_color.v) ? 0 : hsv_color.v
				
				hsv_color.h = Math.round(hsv_color.h)
				hsv_color.s = Math.round(hsv_color.s * 100.0)
				hsv_color.v = Math.round(hsv_color.v * 100.0)

				return (
					`hsv(${hsv_color.h}, ${hsv_color.s}%, ${hsv_color.v}%, ${rgba.colors[3]})`
				)
			}
		}
	]

	$: active_color = Object.values(colors)[0][themenames[0]]
	let search_query = ''
	$: viewables = search_query !== '' ? fuse.search(search_query).map(({ item }) => item) : Object.keys(colors)
</script>

<div class="search">
	<Search bind:value={search_query} />
</div>

<div class="themenames">
	<div></div>
	{#each themenames as themename}
		<div class='themename'>{ themename }</div>
	{/each}
</div>

<div class="grid">
    {#each Object.entries(colors) as [tokenname, themes], i}
	{#if viewables.includes(tokenname)}
	<div class="token">
		<div class="tokenname">
			{ tokenname }
		</div>
		{#each themenames as themename}
			<button 
				class="colorsquare"
				style="background-color: rgba({themes[themename].colors[0]*255}, {themes[themename].colors[1]*255}, {themes[themename].colors[2]*255}, {themes[themename].colors[3]})"
				on:click={() => active_color = themes[themename] }
			/>
		{/each}
	</div>
	{/if}	
    {/each}
</div>

<div class="copy-code" style="background-color: rgba({active_color.colors[0]*255}, {active_color.colors[1]*255}, {active_color.colors[2]*255}, {active_color.colors[3]})">
	{#each output_formats as fmt}
	<CodeSnippet code={ fmt.transformer(active_color) } />
	{/each}
</div>
	
<style>
	.search {
		margin: 0 auto;
		max-width: 300px;
	}
	.copy-code {
		/* font-size: 2em; */
		position: fixed;
		bottom: 10px;
		right: 10px;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		background-color: var(--cds-tag-background-gray);
		padding: 2em;
		width: 350px;
		max-width: 500px;
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
		width: 140px;
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
</style>

