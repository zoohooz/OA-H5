<template>
	<view class="content">
		<view style="background-color: #208ffb;width: 100%;height:450rpx;position:relative">
			<image class="logo" src="/static/img/logo.png"></image>
			<image class="logo1" src="/static/img/iconLogo.png"></image>
			<view class="text-area">
				<text class="title"><b>欢迎登入管理系统</b></text>
			</view>
		</view>

		<PanelGroup @handleSetLineChartData="handleSetLineChartData" />

		<Recentnews ></Recentnews>
	</view>
</template>

<script>
	import PanelGroup from './dashboard/PanelGroup.vue'
	import Recentnews from './dashboard/Recentnews.vue'

	export default {
		components: {
			PanelGroup,
			Recentnews
		},
		onLoad: function() {}
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.logo {
		height: 280rpx;
		width: 400rpx;
		left: 5px;
		position: absolute;
	}

	.logo1 {
		height: 420rpx;
		width:430rpx;
		right: -50px;
		bottom:-5px;
		position: absolute;
	}

	.text-area {
		display: flex;
		justify-content: center;
		margin-bottom: 80rpx;
	}

	.title {
		font-size: 48rpx;
		color: white;
		bottom: 40px;
		position: absolute;
		letter-spacing:3px;
	}
</style>
