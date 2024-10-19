<template>

	<WelcomeItem>
		<template #heading>Documentation

		</template>

		<div :style="{width: '1000px', margin: 'auto', textAlign:'center'}">
			<a-radio-group v-model:value="size" :style="{overflow: 'auto', height: '100px'}">
				<a-radio-button :style="{margin: '2px'}" v-for="item in state.dataArray" @click='refreshStock(item.id)'>{{ item.name}}</a-radio-button>
				<a-button type="primary" @click='queryDaily'>获取今日数据</a-button>
			</a-radio-group>
			
		</div>
		<div id="myChart" :style="{width: '1000px', height: '80%', display: 'flex'}" />

	</WelcomeItem>
</template>

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
<script>
	import * as echarts from 'echarts'
	import axios from 'axios';
	import {
		ref,onMounted,reactive
	} from 'vue';

	export default {


		setup() {
    const state = reactive({
          dataArray: [],size:10
        });

			onMounted(async () => {
				// 在组件挂载到DOM后执行一些初始化操作
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
				const day = currentDate.getDate().toString().padStart(2, '0');
				const formattedDate = `${year}${month}${day}`;

				console.log(formattedDate);

				axios.post('http://122.51.215.230:8000/queryCommandStock/', {
					date: formattedDate
				}, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response) {

					var index = 0

					console.log(response.data.stockName[0])
					while (response.data.stockName[index] != null) {
						var obj = new Object();
						obj.id = response.data.stockCode[index];
						obj.name = response.data.stockName[index] + '(' + response.data.stockCode[index] + ')'
						// stockName.push(response.data.stockName[index])
						//stockCode.push(response.data.stockCode[index])
						state.dataArray.push(obj)
						index = index + 1;

					}
					state.size=index;
					console.log(state.dataArray)
				}).catch(function(error) {
					console.log(error)
				})
			});
			const queryDaily = async() =>{
				console.log("请求")
				axios.get('http://122.51.215.230:8000/queryDailyStock/', {
						code: "stockcode.value"
					}, {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						
						console.log(response.data)
					})
					.catch(function(error) {
						console.log(error);
					});
				
			}
			const refreshStock = (stockcode) => {
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
						code: stockcode
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

						const myChart = echarts.init(document.getElementById('myChart'));
						myChart.setOption({
							title: {
								text: stockcode,
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
								// left: 'left',
								top:'20px'

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
				state,
				refreshStock,
				queryDaily
			}
		}

	}
</script>