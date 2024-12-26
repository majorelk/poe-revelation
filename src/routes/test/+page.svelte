<script lang="ts">
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		console.log('Glizzy');
	});
</script>

<h1 class="h1">Table: {data.tableName}</h1>

{#if data.headers.length > 0}
	<div class="container">
		<h2 class="h2">Headers</h2>
			<dl class="list-dl">
        {#each data.headers as header, index}
          <div>
            <span class="badge-icon p-4 variant-soft-secondary">
              {index + 1}
            </span>
            <span class="flex-auto">
              <dt class="font-bold">{header.name || `Column_${index}`}</dt>
              <dd class="text-sm opacity-50">Offset: {header.offset}, Length: {header.length}</dd>
            </span>
            <!-- <span>⋮</span> -->
          </div>
        {/each}
			</dl>
	</div>
{/if}

{#if data.rows.length > 0}
	<h2>Rows</h2>
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
{:else}
	<p>Loading or no data available.</p>
{/if}
