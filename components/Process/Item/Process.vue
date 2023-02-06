<template>
	<view class="view_image">
		<div v-if='!procrssUrl'> 流程审批历史图加载中……</div>
		<image mode="aspectFit" :src="procrssUrl" @click="previewImage"></image>
	</view>
</template>

<script>
	import config from '@/config'
	import {getProcessUrl} from '@/api/getProcessUrl'
	const baseUrl = config.baseUrl
	export default {
		props: {
			processInstanceId: String,
		},
		components: {},
		data() {
			return {
				procrssUrl: '',
			}
		},
		watch: {
			processInstanceId: {
				handler(newVal, oldVal) {
					if (newVal) {
						// 通过流程实例id获取历史流程图
						this.procrssUrl = baseUrl+'/workflow/processInstance/getHistoryProcessImage?processInstanceId='+newVal
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			previewImage() {
				console.log('点击图片')
				uni.previewImage({
					current: 0,
					urls: [this.procrssUrl]
				});
			},
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {
			//页面初次渲染完成
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
		},
		onHide() {
			//页面隐藏再次执行
		},
		onError() {
			//出现错误
		},
		onPullDownRefresh() {
			//触发了下拉刷新
		}
	}
</script>

<style scoped lang="scss">
.view_image{
	text-align: center;
	margin: 50px;
}
</style>
