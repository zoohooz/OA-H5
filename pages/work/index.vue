<template>
	<view class="work-container">
		<!-- 轮播图 -->
		<!-- <uni-swiper-dot class="uni-swiper-dot-box" :info="data" :current="current" field="content">
      <swiper class="swiper-box" :current="swiperDotIndex" @change="changeSwiper">
        <swiper-item v-for="(item, index) in data" :key="index">
          
        </swiper-item>
      </swiper>
    </uni-swiper-dot> -->
		
		  <view class="banner_img">
				<image mode="aspectFill" src="/static/img/banner.jpg"></image>
		  </view>
		<!-- 宫格组件 -->
		<!-- <uni-collapse accordion> --><!--  -->
		<!-- <uni-collapse-item title="系统管理" :open="true"> -->
		<view v-for="(item,index) in Routes" :key="index">
			<uni-section :title="item.meta.title" type="line"></uni-section>
			<view class="grid-body">
				<u-grid :col="4" :border="false">
					<u-grid-item v-for="(ele,indexs) in item.children" :key="indexs" :index="indexs">
						<view class="grid-item-box" @click='changeGrid(ele.component)'>
							<!-- <text>{{ele.meta.icon}}</text> -->
							<!-- <text :class="'iconfont icon-'+ele.meta.icon"></text> -->
							<image class="menu_icon" mode="aspectFill" :src="`/static/img/menu_icon/${ele.meta.title}.png`"></image>
							<text class="text">{{ele.meta.title}}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>

		</view>
		<!-- </uni-collapse-item> -->
		<!-- </uni-collapse> -->


	</view>
</template>

<script>
	import {
		getRouters
	} from '@/api/menu'
	import {
		mapGetters
	} from 'vuex'


	export default {
		computed: {
			...mapGetters(["allRoutes", 'roles']),
			Routes: function() {
				let ignoreList = ['Tool','Monitor','Workflow','Report'];
				this.routerList = this.allRoutes.filter(
					(item) => ignoreList.indexOf(item.name) == -1
				);
				
				return this.routerList.reverse();
			},
		},
		components: {

		},
		data() {
			return {
				current: 0,
				swiperDotIndex: 0,
				data: [{
						image: '/static/images/banner/banner01.jpg'
					},
					{
						image: '/static/images/banner/banner02.jpg'
					},
					{
						image: '/static/images/banner/banner03.jpg'
					}
				],
			}
		},
		created() {},
		methods: {
			clickBannerItem(item) {
				console.info(item)
			},
			changeSwiper(e) {
				this.current = e.detail.current
			},
			changeGrid(e) {
				console.log(e)
				
				uni.navigateTo({
					url: '/pages/' + e
				}).catch(e =>{
					console.log(e)
					this.$modal.showToast('模块建设中~')
				});
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 图片
	.banner_img{
		width: 100vw;
		// height: 200px;
		uni-image{
			width: 100%;
			img{
				width: 1125px;
				height: 480px;
			}
		}
	}
	// 标题栏
	.uni-section{
		background-color: #f1f1f1;
		::v-deep .uni-section-header__decoration.line{
			height: 20px;
		}
		::v-deep .uni-section-header__content{
			.uni-section__content-title{
				font-size: 18px !important;
				font-weight: 600;
			}
		}
	}
	// 图标
	.menu_icon{
		width: 30px;
		height: 30px;
	}
	
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	/* #endif */

	.text {
		text-align: center;
		font-size: 13px;
		// font-size: 26rpx;
		margin-top: 10rpx;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
		;
	}

	.swiper {
		height: 300rpx;
	}

	.swiper-box {
		height: 150px;
	}

	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		height: 300rpx;
		line-height: 300rpx;
	}

	@media screen and (min-width: 500px) {
		// 图标
		.menu_icon{
			width: 50px;
			height: 50px;
		}
		.text {
			font-size: 30rpx;
		}
		.uni-swiper-dot-box {
			width: 400px;
			/* #ifndef APP-NVUE */
			margin: 0 auto;
			/* #endif */
			margin-top: 8px;
		}

		.image {
			width: 100%;
		}
	}
</style>
