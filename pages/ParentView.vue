<template>
	<view class="form_list">
		
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['操作日志','登录日志']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-show="current === 0">
			<Operlog ref="OperlogRef"></Operlog>
		</view>
		
		<view v-show="current === 1">
			<Logininfor ref="LogininforRef"></Logininfor>
		</view>
		
	</view>
</template>

<script>
	import Operlog from './system/monitor/operlog/index.vue'
	import Logininfor from './system/monitor/logininfor/index.vue'
	export default {
		components: {
			Operlog,
			Logininfor
		},
		data() {
			return {
				// 分段器
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
		mounted() {
		},
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

</style>