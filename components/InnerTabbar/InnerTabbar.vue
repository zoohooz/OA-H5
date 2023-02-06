<template>
	<view class="inner_tabbar">
		<view class="inner_tabbar_item">
			<uni-icons type="plusempty" size="30" class="i"></uni-icons>
			<text class="b">新申请</text>
		</view>
		
		<view class="inner_tabbar_item">
			<uni-icons type="arrow-up" size="30" class="i"></uni-icons>
			<text class="b">已提交</text>
		</view>
		
		<span></span>
	</view>
</template>

<script>
	export default {
		name:'InnerTabbar',
		components: {},
		data() {
			return {}
		},
		methods: {
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
// .inner_tabbar inner_tabbar_item 原始布局
	.inner_tabbar{
		position: fixed;
		bottom: 0px;
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fbfcfe;
		overflow: hidden;
		
		.inner_tabbar_item{
			display: flex;
			justify-content: center;
			align-items: center;
			// background-color: #ffffff;
			text-decoration: none;
			z-index: 2;
			width: 50%;
			height: 50px;
			padding: 10px;
			box-sizing: border-box;
			text-align: center;
			font-size: 15px;
			color: white;
		}
	}
	// inner_tabbar inner_tabbar_item 动画布局
	.inner_tabbar {
		.inner_tabbar_item{
			.b{
				position: relative;
				top: 40px;
				transition: 0.3s ease top;
			}
			.i{
				position: relative;
				left: 15%;
				transition: 0.3s ease left;
			}
		} 
		.inner_tabbar_item:hover{
			.b { top: 0;color: white;}
			.i { left: 0; color: white !important}
		} 
	} 
	//遮罩层
	.inner_tabbar span{
		position: absolute;
		top: 10px;
		bottom: 10px;
		left: 10px;
		width: 50%;
		background-color: #427ce4;
		z-index: 1;
		border-radius: 50px;
		transition: 0.3s ease left;
	}
	.inner_tabbar .inner_tabbar_item:nth-child(1):hover~span {
		left: 10px;
	}
	.inner_tabbar .inner_tabbar_item:nth-child(2):hover~span {
		left: 50%;
	}
</style>