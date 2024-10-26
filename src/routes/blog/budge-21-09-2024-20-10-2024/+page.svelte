<script lang="ts">

  import Pie from '$lib/components/budget/overall_pie.svelte'
  import OverallTable from '$lib/components/budget/overall_table.svelte'
  import summary_eur from './metadata/summary_eur.json'
  import summary_cny from './metadata/summary_cny.json'
  import categoryData from './metadata/category_data.json'
  import category_detail_Meal from './metadata/category_detail_Meal.json'
  import category_detail_SuperMarket from './metadata/category_detail_Supermarket.json'
  import category_detail_Transport from './metadata/category_detail_Transportation.json'
  // New imports
  import category_detail_OnlineShopping from './metadata/category_detail_Online Shopping.json'
  import category_detail_Onetime from './metadata/category_detail_Onetime.json'
  import category_detail_Housing from './metadata/category_detail_Housing.json'
  import category_detail_Hotel from './metadata/category_detail_Hotel.json'
  import category_detail_Furniture from './metadata/category_detail_Furniture.json'
  import category_detail_Subscription from './metadata/category_detail_Subscription.json'
  import category_detail_Communication from './metadata/category_detail_Communication.json'
</script>

<div>
  <h1 class="text-3xl font-bold p-4">Expense 21/09/2024 - 20/10/2024</h1>
  <h2 class="text-2xl font-medium p-4">
    CNY : EUR = 8 : 1 ; USD : EUR = 1 : 1 ; JPY : EUR = 150 : 1
  </h2>
  <div class="flex flex-col md:flex-row justify-between p-4">
    <div class="mb-4 md:mb-0">
      <h2 class="text-xl font-medium">EUR Summary</h2>
      <OverallTable data={summary_eur} />
    </div>
    <div>
      <h2 class="text-xl font-medium">CNY Summary</h2>
      <OverallTable data={summary_cny} />
    </div>
  </div>
  <div class="flex flex-col w-full">
    <div class="w-full aspect-[1.2/1] mb-4">
      <Pie data={categoryData} title='Overall Expense By Category (EUR)'/>
    </div>
    <div class="flex flex-wrap w-full">
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Meal} title='Meal Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_SuperMarket} title='SuperMarket Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Transport} title='Transportation Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_OnlineShopping} title='Online Shopping Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Onetime} title='Onetime Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Housing} title='Housing Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Hotel} title='Hotel Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Furniture} title='Furniture Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Subscription} title='Subscription Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
      <div class="w-1/2 aspect-1">
        <Pie data={category_detail_Communication} title='Communication Expense By Category (EUR)' fontSize={16} showLegend={false}/>
      </div>
    </div>
  </div>
</div>
