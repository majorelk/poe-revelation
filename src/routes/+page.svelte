<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	let selectedVersion = data.selectedVersion || '1';

	function handleVersionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const version = target.value;
		goto(`?version=${version}`);
	}

  onMount(() => {
    console.log(data);
    
  });


	function selectTable(): import("svelte/elements").MouseEventHandler<HTMLAnchorElement> | null | undefined {
		// set the url param to the selected table
    return (event) => {
      const version = selectedVersion;
      const target = event.target as HTMLAnchorElement;
      // const table = target.innerText;
      // without the extension .datc64
      const table = target.innerText.split('.')[0];
      goto(`?version=${version}&table=${table}`);
    };
	}
</script>

<div>
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
	<p>Current Patch URL: {data.patchUrl}</p>
</div>

<h1 class="h1">Table: {data.tableName}</h1>

<div class="container flex flex-row h-screen">
	<div class="flex max-h-full overflow-scroll">
		<!-- Table directory goes here -->
		{#if data.datFiles.length > 0}
			<ul>
				{#each data.datFiles as file}
					<li>
						<a on:click={selectTable()}>{file.name}</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No .datc64 files found in the directory.</p>
		{/if}
	</div>

	{#if data.rows.length > 0}
		<div class="flex">
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							{#each data.headers as header, index}
								<th>{header.name || `Column_${index}`}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.rows as row}
							<tr>
								{#each data.headers as header, index}
									<td class=" max-w-32 overflow-auto">{row[header.name || `Column_${index}`]}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<p>Loading or no data available.</p>
	{/if}
</div>
