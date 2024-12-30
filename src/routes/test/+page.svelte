<script lang="ts">
	// @ts-nocheck

	//Import local datatable components
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import ThFilter from '$lib/components/datatable/ThFilter.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import RowsPerPage from '$lib/components/datatable/RowsPerPage.svelte';
	import RowCount from '$lib/components/datatable/RowCount.svelte';
	import Pagination from '$lib/components/datatable/Pagination.svelte';

	// import data from '$lib/components/datatable/data';
	export let data;
	let headers: string[] = [];
	$: headers = data.headers.map((header) => header.name || `Column`);

	//Import handler from SSD
	import { DataHandler } from '@vincjo/datatables/legacy';

	//Init data handler - CLIENT
	const handler = new DataHandler(data.rows, { rowsPerPage: 10 });
	const rows = handler.getRows();
</script>

<div class="table-container max-h-[100vh] relative">
	<header class="flex justify-between gap-4">
		<Search {handler} />
		<RowsPerPage {handler} />
	</header>
	<div class="sticky top-0 rounded">
		<table>
			<thead>
				<tr class="bg-slate-900">
          <th class="p-2 rowCount">Row</th>
					{#each headers as header, index}
						<ThSort {handler} orderBy={header}>{header}</ThSort>
					{/each}
				</tr>
				<tr class="bg-slate-900">
          <th class="p-2 rowCount">
          </th>
					{#each headers as header, index}
						<ThFilter {handler} filterBy={header}>{header}</ThFilter>
					{/each}
				</tr>
			</thead>
		</table>
	</div>
	<table class="table table-hover border-collapse">
		<tbody>
			{#each $rows as row, index}
				<tr>
					<td class=" p-2 rowCount">
						{index}
					</td>

					{#each data.headers as header, index}
						<td class=" p-2">
							{row[header.name || `Column_${index}`]}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<footer class="flex justify-between">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
</div>

<style>
	.table-container table {
		width: 100vw;
		border-collapse: collapse;
		table-layout: fixed;
	}

	th,
	td {
		width: 20vw;
		text-align: left;
		text-overflow: ellipsis;
		white-space: normal;
		overflow: hidden;
	}

	.rowCount {
		width: 5vw;
	}
</style>
