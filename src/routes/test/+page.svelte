<script lang="ts">
	import { onMount } from 'svelte';

  export let data; 

  onMount(() => {
    console.log("Glizzy");
  });
</script>

<h1>Table: {data.tableName}</h1>

{#if data.headers.length > 0}
  <h2>Headers</h2>
  <ul>
    {#each data.headers as header, index}
      <li>
        {header.name || `Column_${index}`} 
        (Offset: {header.offset}, Length: {header.length})
      </li>
    {/each}
  </ul>
{/if}

{#if data.rows.length > 0}
  <h2>Rows</h2>
  <table>
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
            <td>{row[header.name || `Column_${index}`]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Loading or no data available.</p>
{/if}
