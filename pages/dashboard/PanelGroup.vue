<template>
	<view class="outer_panl">
		<uni-row :gutter="5">
			<uni-col v-for="(item,index) in itemList" :key="index" :span="1.5">
				<uni-card @click="changeCar(item.src)" class="radius" :style="'background-color:'+item.bgcolor">
					<view class="index_item">
						<view style="color: white;">
							<text style="font-size: 44px;margin-top:5px;display: block;"><b>{{item.data}}</b></text>
							<text style="font-size: 14px;margin-top: 10px;display: block;">{{item.title}}</text>
						</view>
						<view :style="'background-color:'+item.round" class="cardRadius">
							<image :src="item.imgUrl" mode="" style="width: 34px;height: 34px;text-align:center;margin-left:25%;margin-top: 20%;"></image></text>
						</view>
					</view>
				</uni-card>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import task from '@/api/workflow/task'
	import {
		list
	} from "@/api/monitor/online";

	export default {
		components: {},
		data() {
			return {
				// 页面显示
				itemList: [{
						icon: 'peoples',
						color: '#40c9c6',
						title: '在线用户',
						data: '0',
						src: 'monitor/online/index',
						bgcolor:'#4ebcf1',
						imgUrl:require('../../static/img/online.png'),
						round:'#0181fe'
					},
					{
						icon: 'message',
						color: '#36a3f7',
						title: '待办任务',
						data: '0',
						src: 'workflow/task/personalWaiting',
						bgcolor:'#6ceaaa',
						imgUrl:require('../../static/img/waiting.png'),
						round:'#23ab7d'
					},
					// {
					// 	icon: 'money1',
					// 	color: '#f4516c',
					// 	title: '财务系统',
					// 	data: '9280',
					// 	src: '',
					// },
					// {
					// 	icon: 'shopping',
					// 	color: '#34bfa3',
					// 	title: '订单',
					// 	data: '13600',
					// 	src: '',
					// },


				],
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
				},
				// 查询参数
				queryUserParams: {
					ipaddr: undefined,
					userName: undefined
				},
				taskNum: 0,
				userNum: 0,
			}
		},
		created() {
			this.getUserList();
			this.getTaskList();
		},
		methods: {
			// 页面跳转
			changeCar(src) {
				if(src){
					uni.navigateTo({
						url: '/pages/'+src
					});
				}else{
					this.$modal.showToast('模块建设中~')
				}
			},
			handleSetLineChartData(type) {
				this.$emit('handleSetLineChartData', type)
			},
			handleAgents() {
				this.$router.push('/workflowPersonal/personalWaiting')
			},
			handleOnline() {
				this.$router.push('/monitor/online')
			},
			/** 查询在线用户列表 */
			getUserList() {
				list(this.queryUserParams).then(response => {
					// this.userNum = response.total;
					this.itemList[0].data = response.total 
				});
			},
			getTaskList() {
				task.getTaskWaitByPage(this.queryParams).then(response => {
					// this.taskNum = response.total;
					this.itemList[1].data = response.total 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.radius{
		border-radius: 15px;
	}
	.cardRadius{
		border-radius: 50px;
	}
	.uni-row{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		.uni-col{
			    // flex: 2;
					flex:0 0 50%;//不放大 不缩小 占据空间
		}
	}
	.uni-card:hover {
		.index_item {
			view:nth-of-type(2) {
				background-color: var(--iconColor);
				text {
					color: white;
				}
			}
		}
	}

	.index_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 116px;
		position: relative;
		view:nth-of-type(2) {
			height: 82px;
			width: 82px;
			line-height: 62px;
			right: -30px;
			bottom: -30px;
			position: absolute;
			text {
				font-size: 60px;
				// color: var(--iconColor);
				text-align: center;
			}
		}

		view:nth-of-type(1) {
			display: flex;
			flex-direction: column;
		}
	}

	@media (max-width:550px) {
		.card-panel-description {
			display: none;
		}

		.card-panel-icon-wrapper {
			float: none !important;
			width: 100%;
			height: 100%;
			margin: 0 !important;

			.svg-icon {
				display: block;
				margin: 14px auto !important;
				float: none !important;
			}
		}
	}
</style>
