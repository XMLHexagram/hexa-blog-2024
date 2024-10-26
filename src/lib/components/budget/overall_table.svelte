<script lang="ts">
  interface OverallData {
    "Total Spending": string;
    Refundable: string;
    Income: string;
    "Net Spending": string;
  }

  export let data: OverallData;
</script>

<div class="overflow-x-auto">
  <table class="w-ful shadow-md rounded-lg border">
    <thead>
      <tr>
        {#each Object.keys(data) as category}
          <th class="border p-3 text-left text-sm font-medium uppercase tracking-wider">
            {category}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr>
        {#each Object.values(data) as value}
          <td class="border p-3 text-sm font-semibold">
            {value}
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>
