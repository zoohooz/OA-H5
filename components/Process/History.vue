<template>
	<view>
		<uni-section title="审批记录" type="line">
			<view class="uni-padding-wrap uni-common-mt">
				<uni-segmented-control :current="current" :values="items" style-type="button"
					active-color="#007aff" @clickItem="onClickItem" />
			</view>
			<view class="content">
				<view v-show="current === 0">
					<Opinions :processInstanceId="processInstanceId"  />
				</view>
				<view v-show="current === 1">
					<Process :processInstanceId="processInstanceId"/>
				</view>
			</view>
		</uni-section>
	</view>
</template>

<script>
import Process from './Item/Process.vue'
import Opinions from './Item/Opinions.vue'
	export default {
		components: {
			Process,
			Opinions
		},
		data() {
			return {
				// 组件数据
				processInstanceId:'',
				//样式数据
				items: ['审批意见', '流程进度'],
				current: 0,
				colorIndex: 0,
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			console.log('History-option->',option)
			//页面初次渲染完成
			this.processInstanceId = option.data.processInstanceId
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

<style>

</style>
