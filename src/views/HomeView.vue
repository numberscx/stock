<script lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import axios from 'axios';

import { ref } from 'vue';
export default {
	setup() {
		const activeKey = ref('1');

		return {
			activeKey
		}
	}

}

</script>

<template>
  <WelcomeItem>

		

  	<div :style="{width: '1000px', height:'80%',margin: '10px', textAlign:'center'}">
			  <a-tabs v-model:activeKey="activeKey">
			    <a-tab-pane key="1" tab="登录" class = "infoform">
						<h2>用户登录</h2>
						
						<label for="username">账号:</label>
						<input v-model="username" placeholder="请输入账号名" /><br/>

						<label for="password">密码:</label>
						<input v-model="password" placeholder="请输入密码" /><br/>
						
						<a-button type="primary" ghost>登录</a-button>
						<a-button type="primary" ghost>忘记密码</a-button>

						
				</a-tab-pane>
			    <a-tab-pane key="2" tab="注册" force-render class = "infoform">
						<h2>用户注册</h2>
						<label for="username">账号:</label>
						<input v-model="username" placeholder="请输入账号名" /><br/>

						<label for="password">密码:</label>
						<input v-model="password" placeholder="请输入密码" /><br/>
							
						<label for="phone">手机号:</label>
						
						<input v-model="phonenum" placeholder="请输入手机号" />
						<a-button type="primary" ghost>获取验证码</a-button><br/>
						<label for="validate">验证码:</label>
						<input type="validate" id="validate" v-model="validate"/>
						<a-button type="primary" ghost>注册</a-button>
					</a-tab-pane>
			  </a-tabs>
			</div>
  
  	</WelcomeItem>
  	
</template>
<style>
	#myChart{
		min-height: 60vh;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.clearfix:after{content:"\20";display:block;height:0;clear:both;visibility:hidden}.clearfix{zoom:1}
	.tabBar {border-bottom: 2px solid #222}
	.tabBar span {background-color: #e8e8e8;cursor: pointer;display: inline-block;float: left;font-weight: bold;height: 30px;line-height: 30px;padding: 0 15px}
	.tabBar span.current{background-color: #222;color: #fff}
	.tabCon {display: none}
	button,label,input{
		margin: 10px;
	}
	.infoform{
		text-align: left;
		margin-left:30%;
	}

</style>
