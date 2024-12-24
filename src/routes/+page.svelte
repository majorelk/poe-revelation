<script lang="ts">
  export let data: {
    headers: any[];
    rows: { [key: string]: any }[];
    tableName: string;
  };

  $: console.log(data);
</script>

<h1>Table: {data.tableName}</h1>
<!-- 
{#if data.headers.length > 0}
  <h2>Headers</h2>
  <ul>
    {#each data.headers as header}
      <li>{header.name} (Offset: {header.offset}, Length: {header.length})</li>
    {/each}
  </ul>
{/if}

{#if data.rows.length > 0}
  <h2>Rows</h2>
  <table>
    <thead>
      <tr>
        {#each data.headers as header}
          <th>{header.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data.rows as row}
        <tr>
          {#each data.headers as header}
            <td>{row[header.name]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Loading or no data available.</p>
{/if} -->
