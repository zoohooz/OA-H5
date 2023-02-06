<!-- 公司新闻 最近消息 -->
<template>
	<view class="recentnews_content">
		
			<uni-title type="h3" title="公司新闻"></uni-title>
			
			<view class="recentnews_content_inner">
			<uni-card 
			  v-for="(item,index) in isShowContent"
				:key="index"
				:title="item.noticeTitle" 
				:extra="item.createTime" 
				padding="0px" 
				:border="false" 
				:isFull="true" 
				:is-shadow="false"
				@click="handlerCard(item)"
			>
				<!-- <uni-title type="h1"></uni-title> -->
				<!-- <text class="uni-body">{{item.noticeTitle}}</text> -->
	
			</uni-card>
			
			</view>
	</view>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
	export default {
		components: {},
		data() {
			return {
				// 查询参数
				      queryParams: {
				        pageNum: 1,
				        pageSize: 10,
				        noticeTitle: undefined,
				        createBy: undefined,
				        status: undefined,
				      },
				noticeList:[],
			}
		},
		computed:{
			isShowContent(){
				return this.noticeList.filter(item => {
					return item.status === '0'
				})
			}
		},
		methods: {
			/** 查询公告列表 */
			    getList() {
			      listNotice(this.queryParams).then(response => {
							console.log('通知公告--->',response)
			        this.noticeList = response.rows;
			        this.total = response.total;
			        this.loading = false;
			      });
			    },
					handlerCard(item){
						this.$tab.navigateTo(
						`/pages/system/notice/noticeDetails?type=news&id=${item.noticeId}`
						)
					},
		},
		mounted() {
		},
		created() {
			this.getList();
			
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
			this.getList();
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
.recentnews_content{
			height: 256px;
			width: 95vw;
			overflow: hidden;
			position: fixed;
	    bottom: 60px;
			background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
	    background-color: white;
	    border-radius: 5px;
			box-shadow: none;
			// box-shadow: rgb(0 0 0 / 8%) 0px 0px 3px 1px inset;
			// margin: 0px 10px;
			padding-bottom: 25px;
		::v-deep .uni-title__box{
			span{
				padding: 10px;
				color: #909399;
			}
		}
		.recentnews_content_inner{
			height: 100%;
			overflow-x: hidden;
			overflow-y: scroll;
		}
		.uni-card{
			// margin: 5px 0px !important;
			// padding: 0px !important;
			// box-shadow: none !important;
			// border: none !important;
			::v-deep .uni-card__content{
				// padding: 5px 10px !important;
				.uni-body{
					span{
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
					}
				}
			}
		}
}
</style>