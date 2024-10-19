<template>
	<WelcomeItem>
		<template #heading>Documentation

		</template>
		<div :style="{width: '1000px', margin: 'auto', textAlign:'center'}">
			<input v-model="stockcode" />
			<a-button type="primary" @click='refreshStock'>股票详情</a-button>
		</div>

		<div id="myChart" :style="{width: '1000px', height: '100%', display: 'flex'}" />

	</WelcomeItem>

</template>
<script>
	import * as echarts from 'echarts'
	import axios from 'axios';
	import {
		ref
	} from 'vue';
	const date = ['1', '2', '3', '4', '5']
	const serisk = [1, 2, 3, 4, 5]
	const markPoint = []


	export default {
		setup() {
			const stockcode = ref('002085')
			console.log(stockcode.value)

			const refreshStock = () => {
				var kseri = []
				var markPoint = []
				var sma5 = []
				var sma10 = []
				var sma20 = []
				var xdata = []
				var candledata = []
				var volume = []

				var macdh = []
				var macds = []
				var macdf = []

				axios.post('http://122.51.215.230:8000/querysimple/', {
						code: stockcode.value
					}, {
						headers: {
							'Content-Type': 'application/json'
						}
					})
					.then(function(response) {
						// console.log(response);

						var index = 0
						var dataMin = 1000000
						var dataMax = 0
						while (response.data.时间[index] != null) {
							xdata.push(response.data.时间[index])
							kseri.push(response.data.收盘[index].toFixed(2))
							candledata.push([response.data.开盘[index].toFixed(2), response.data.收盘[index].toFixed(2),
								response.data.最低[index], response.data.最高[index]
							])
							sma5.push(response.data.ma5[index].toFixed(2))
							sma10.push(response.data.ma10[index].toFixed(2))
							sma20.push(response.data.ma20[index].toFixed(2))
							macdh.push(response.data.MACDh_12_26_9[index])
							macds.push(response.data.MACDs_12_26_9[index])
							macdf.push(response.data.MACD_12_26_9[index])

							volume.push(response.data.成交量[index])
							if (sma5[index] == 0) {
								sma5[index] = kseri[index]
							}
							if (sma10[index] == 0) {
								sma10[index] = kseri[index]
							}
							if (sma20[index] == 0) {
								sma20[index] = kseri[index]
							}
							dataMin = Math.min(kseri[index], dataMin)
							dataMax = Math.max(kseri[index], dataMax)

							index = index + 1
						}
						let marks = response.data.buyAndSell

						for (var i = 0; i < index; i++) {
							if (marks[i] == 1) {
								markPoint.push({
									name: '买点',
									symbol: 'pin',
									itemStyle: {
										color: ''
									},
									value: 'B',
									xAxis: xdata[i],
									yAxis: sma10[i]
								})
							} else if (marks[i] == -1) {
								markPoint.push({
									name: '卖点',
									symbol: 'arrow',
									value: 'S',
									xAxis: xdata[i],
									yAxis: sma5[i]
								})

							}
						}


						// console.log(markPoint)
						// console.log(xdata)
						// console.log(kseri)
						const myChart = echarts.init(document.getElementById('myChart'));
						myChart.setOption({
							title: {
								text: '股票走势',
								left: 'center'
							},
							tooltip: {
								trigger: 'axis'
							},
							toolbox: {
								show: true,
								feature: {
									      dataZoom: {
									        yAxisIndex: 'none'
									      },
									      restore: {},
									      saveAsImage: {}
								}
							},
							dataZoom: [{
									type: 'slider',
									xAxisIndex: [0, 1, 2],
									realtime: false,
									start: 20,
									end: 70,
									top: 65,
									height: 20,
									handleIcon: 'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
									handleSize: '120%'
								},
								{
									type: 'inside',
									xAxisIndex: [0, 1, 2],
									start: 40,
									end: 70,
									top: 30,
									height: 20
								}
							],
							legend: {
								top: 'top'
							},
							xAxis: [{
									splitNumber: 30,

									type: 'category',
									name: 'x',
									splitLine: {
										show: false
									},
									data: xdata
								}, {
									splitNumber: 30,
									gridIndex: 1,
									axisLabel: {
										show: false
									},
									axisLine: {
										show: false
									},
									axisTick: {
										show: false
									},
									splitLine: {
										show: false
									},
									type: 'category',
									name: 'x',
									splitLine: {
										show: false
									},
									data: xdata
								},
								{
									splitNumber: 30,
									gridIndex: 2,
									axisLabel: {
										show: false
									},
									axisLine: {
										show: false
									},
									axisTick: {
										show: false
									},
									splitLine: {
										show: false
									},
									type: 'category',
									name: 'macd',
									splitLine: {
										show: false
									},
									data: xdata
								}
							],
							grid: [{
									left: '10%',
									right: '10%',
									bottom: 200
								},
								{
									left: '10%',
									right: '10%',
									height: '30%',
									bottom: 80
								},
								{
									left: '10%',
									right: '10%',
									height: '30%',
									bottom: 10
								}
							],
							yAxis: [{
									name: '价格',
									minorSplitLine: {
										show: true
									},
									scale: true,
									splitNumber: 10
								},
								{
									name: '成交量',
									gridIndex: 1,
									minorSplitLine: {
										show: true
									},
									axisLabel: {
										show: false
									},
									axisLine: {
										show: false
									},
									axisTick: {
										show: false
									},
									splitLine: {
										show: false
									},
									scale: true,
									splitNumber: 10
								},
								{
									name: 'macd',
									gridIndex: 2,
									minorSplitLine: {
										show: true
									},
									scale: true,
									splitNumber: 10
								}
							],
							series: [{
									name: 'k',
									type: 'candlestick',
									data: candledata,
									markPoint: {
										data: markPoint,
										symbolSize: 20
									}
								},
								{
									name: 'ma10',
									type: 'line',
									data: sma10,
									symbolSize: 0
								}, {
									name: 'ma20',
									type: 'line',
									data: sma20,
									symbolSize: 0

								},
								{
									name: 'Volume',
									type: 'bar',
									xAxisIndex: 1,
									yAxisIndex: 1,
									itemStyle: {
										color: '#7fbe9e'
									},
									emphasis: {
										itemStyle: {
											color: '#140'
										}
									},
									data: volume

								},
								{
									name: 'macdh',
									type: 'bar',
									xAxisIndex: 2,
									yAxisIndex: 2,
									itemStyle: {
										color: '#7fbe9e'
									},
									emphasis: {
										itemStyle: {
											color: '#140'
										}
									},
									data: macdh,
									itemStyle: {
										// 默认样式
										normal: {
											// 当数据值大于0时的颜色
											color: function(params) {
												return params.value > 0 ? 'red' : 'green';
											}
										}
									}
								},
								{
									name: 'macdf',
									type: 'line',
									xAxisIndex: 2,
									yAxisIndex: 2,
									itemStyle: {
										color: '#ff00da'
									},
									emphasis: {
										itemStyle: {
											color: '#140'
										}
									},
									data: macdf,
									symbolSize: 0
								},
								{
									name: 'macds',
									type: 'line',
									xAxisIndex: 2,
									yAxisIndex: 2,
									itemStyle: {
										color: '#7fbe9e'
									},
									emphasis: {
										itemStyle: {
											color: '#140'
										}
									},
									data: macds,
									symbolSize: 0
								}
							]
						})
					})
					.catch(function(error) {
						console.log(error);
					});

			};

			return {
				stockcode,
				refreshStock
			}


		}

	}
</script>


<style>
	#myChart {
		min-height: 60vh;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.clearfix:after {
		content: "\20";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden
	}

	.clearfix {
		zoom: 1
	}

	.tabBar {
		border-bottom: 2px solid #222
	}

	.tabBar span {
		background-color: #e8e8e8;
		cursor: pointer;
		display: inline-block;
		float: left;
		font-weight: bold;
		height: 30px;
		line-height: 30px;
		padding: 0 15px
	}

	.tabBar span.current {
		background-color: #222;
		color: #fff
	}

	.tabCon {
		display: none
	}
</style>