<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/legacy/remote';
	export let handler: DataHandler;
	export let filterBy: string;

	let value: string;
	let timeout: any;

	const filter = () => {
		handler.filter(value, filterBy);
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			// handler.invalidate();
		}, 400);
	};
</script>

<th class="p-2">
	<input
		class="input text-sm w-full"
		type="text"
		placeholder="Filter"
		bind:value
		on:input={filter}
	/>
</th>

<style>
	th,
	td {
		width: 20vw;
		text-align: left;
		text-overflow: ellipsis;
		white-space: normal;
		overflow: hidden;
	}
</style>
