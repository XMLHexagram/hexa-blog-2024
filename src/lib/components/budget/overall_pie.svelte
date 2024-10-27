<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { init, use } from 'echarts/core';
	import { PieChart } from 'echarts/charts';
	import { CanvasRenderer } from 'echarts/renderers';
	import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
	import type { EChartsOption } from 'echarts';

	use([PieChart, CanvasRenderer, TitleComponent, LegendComponent, TooltipComponent]);

	interface CategoryItem {
		name: string;
		value: number;
	}

	export let data: CategoryItem[];
	export let title: string;
	export let fontSize: number = 20;
	export let showLegend: boolean = true;

	$: totalAmount = data.reduce((sum, item) => sum + item.value, 0);

	$: chartOptions = {
		backgroundColor: 'transparent',
		title: {
			text: title,
			subtext: `Total: ${totalAmount.toLocaleString()}`
		},
		textStyle: {
			fontSize: fontSize
		},
		legend: showLegend
			? {
					orient: 'vertical',
					right: '0',
					top: '0',
					textStyle: {
						fontSize: 16,
					},
				}
			: undefined,
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		series: [
			{
				name: 'Expense',
				data: data,
				type: 'pie',
				radius: ['0%', '60%'],
				center: ['40%', '50%'],
				label: {
					show: true,
					// position: 'inside',
					formatter: '{b} \n {c} ({d}%)',
					// fontSize: 16
				},
				labelLayout: function (params) {
					if (params.rect.width < 5 || params.rect.height < 5) {
						return {
							fontSize: 0
						};
					}
					return {
						fontSize: Math.min(Math.sqrt(params.rect.width * params.rect.height) / 10, 20)
					};
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	} satisfies EChartsOption;
</script>

<div class="h-full w-full">
	<Chart {init} options={chartOptions} theme="dark" />
</div>
