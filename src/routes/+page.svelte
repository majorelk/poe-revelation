<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { rowStore } from '$lib/stores/rowStore';

	const modalStore = getModalStore();

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

	function prepareBodyData(row: any): string {
		// Recursive function to parse stringified JSON values
		function parseValue(value: any): any {
			if (typeof value === 'string') {
				try {
					const parsed = JSON.parse(value);
					return parseValue(parsed); // Recursively parse in case of nested JSON strings
				} catch (e) {
					return value; // Return the original value if parsing fails
				}
			} else if (typeof value === 'object' && value !== null) {
				// If it's an object or array, recursively process each key or element
				if (Array.isArray(value)) {
					return value.map(parseValue);
				} else {
					return Object.fromEntries(
						Object.entries(value).map(([key, val]) => [key, parseValue(val)])
					);
				}
			}
			return value; // Return primitive values as is
		}

		const parsedRow = parseValue(row);

		// Build the string representation
		console.log('parsedRow:', parsedRow);

		return Object.entries(parsedRow)
			.map(
				([key, value]) =>
					`${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`
			)
			.join('\n');
	}

	function selectRow(row: any): void {
		new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: 'list',
				title: 'Row Data',
				body: prepareBodyData(row),
				response: (r: boolean) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		}).then(async (r: any) => {
			console.log('resolved response:', r);
			if (r) {
				rowStore.set(row);
				goto(`/export?version=${selectedVersion}`);
			}
		});
	}

	function displayValue(value: any): string {
		// Check if the value is an object or an array
		if (value && typeof value === 'object') {
			return JSON.stringify(value, null, 2); // Pretty-print objects and arrays
		}

		// Check if the value is a stringified JSON object
		if (typeof value === 'string') {
			try {
				const parsed = JSON.parse(value);
				if (typeof parsed === 'object' && parsed !== null) {
					return JSON.stringify(parsed, null, 2);
				}
			} catch (e) {
				// If parsing fails, return the original string
			}
		}

		// Return primitive values as is
		return String(value);
	}
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
				<h3 class="h3">Loading it... and by it, I mean the data.</h3>
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
							<tr on:click={() => selectRow(row)}>
								<td class=" p-2 rowCount max-h-20">
									{index}
								</td>

								{#each data.headers as header, index}
									<td class=" p-2 max-h-20">
										{@html displayValue(row[header.name || `Column_${index}`])}
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
