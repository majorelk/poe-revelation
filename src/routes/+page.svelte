<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	let selectedVersion = data.selectedVersion || '1';
	let tableContainer: HTMLDivElement;
	let headerContainer: HTMLDivElement;
	let loading: boolean = true;

	// Headers and rows
	let headers: string[] = [];
	$: headers = data.headers.map((header) => header.name || `Column`);

	$: {
		if (data.headers.length > 0) {
			loading = false;
		}
	}

	function handleVersionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const version = target.value;
		goto(`?version=${version}`);
	}

	function selectTable():
		| import('svelte/elements').MouseEventHandler<HTMLButtonElement>
		| null
		| undefined {
		return (event) => {
			loading = true;
			const version = selectedVersion;
			const target = event.target as HTMLButtonElement;
			const table = target.innerText.split('.')[0];
			goto(`?version=${version}&table=${table}`);
		};
	}

	onMount(() => {
		if (data.headers.length > 0) {
			loading = false;
		}
	});
</script>

<div class="flex flex-row h-screen">
	<!-- Sidebar -->
	<div class="flex flex-col max-h-full w-2/12">
		<div class="sticky top-0 bg-secondary-500 p-4">
			<label for="game-version">Select Game Version: </label>
			<select
				class="input"
				id="game-version"
				bind:value={selectedVersion}
				on:change={handleVersionChange}
			>
				<option value="1">POE 1</option>
				<option value="2">POE 2</option>
			</select>
			<p>Current patch: {data.versionNumber}</p>
			{#if data.tableName !== undefined}
				<h3 class="h3 py-4 text-wrap">Selected table: {data.tableName}</h3>
			{/if}
		</div>

		{#if data.datFiles.length > 0}
			<ul class="overflow-scroll w-full">
				{#each data.datFiles as file}
					<li>
						<button
							type="button"
							class=" btn btn-sm hover:bg-primary-700"
							aria-label="Select Table"
							on:click={selectTable()}>{file.name}</button
						>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No .datc64 files found in the directory.</p>
		{/if}
	</div>

	<!-- Table Section -->
	<div class="relative w-10/12">
		<!-- Scrollable Table Body -->

		{#if loading}
			<div class="absolute inset-0 flex flex-col items-center justify-center">
				<div class="freeloader">
					<div class="box1"></div>
					<div class="box2"></div>
					<div class="box3"></div>
				</div>
        <h3 class="h3">
          Loading it... and by it, I mean the data.
        </h3>
        <sub class="text-xs">Giggity</sub>
			</div>
		{:else if data.rows.length === 0}
			<p>No data found for the selected table.</p>
		{:else}
			<div class="table-container max-h-[100vh] relative" bind:this={tableContainer}>
				<div class="sticky top-0 rounded" bind:this={headerContainer}>
					<table>
						<thead>
							<tr class=" bg-slate-900">
								<th class="p-2 rowCount">Row</th>
								{#each headers as header}
									<th class="p-2">{header}</th>
								{/each}
							</tr>
						</thead>
					</table>
				</div>
				<table class="table table-hover border-collapse">
					<tbody>
						{#each data.rows as row, index}
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
			</div>
		{/if}
	</div>
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
