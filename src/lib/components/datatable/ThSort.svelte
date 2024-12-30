<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/legacy/remote';

	export let handler: DataHandler;
	export let orderBy: string;

	const sort = handler.getSort();
	const update = () => {
		handler.sort(orderBy);
		// handler.invalidate();
	};
</script>

<th on:click={update} class="cursor-pointer select-none p-2 px-5">
	<div class="flex h-full items-center justify-start gap-x-2">
		<slot />
		[sort]
	</div>
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
