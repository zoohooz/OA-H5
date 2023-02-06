<template>
	<view>
		<leaveDetail :isForm='true' :formId="businessKey"></leaveDetail>
		<!-- 操作按钮 -->
		<uni-row class="demo-uni-row example formButtom" :gutter="10">
			<uni-col :span="2.5">
				<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-grey">
					暂存
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-blue">
					提交
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="cancel" class="cu-btn sm block line-whilte">
					取 消
				</button>
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import {
		getLeave,
		fallbackUserDays
	} from "@/api/demo/leave";
	import leaveDetail from '@/pages/business/leave/leaveDetail'
	export default {
		name: 'leaveForm',
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String // 任务id
		},
		components: {
			leaveDetail
		},
		data() {
			return {
				// 按钮loading
				buttonLoading: false,
				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				// 表单参数
				form: {},
				taskVariables: undefined,
				//消息提醒
				sendMessage: {}
			}
		},
		methods: {
			// 取消按钮
			cancel(){
				this.$emit("closeForm")
			},
			// 流程取消回调
			callSubmit(e){
				console.log('表单组件接收到驳回<--',e)
			  if(e == 'back'){
			    fallbackUserDays(this.businessKey)
			  }
			  this.$emit("closeForm")
			},
			/** 提交按钮 */
			submitForm() {
				getLeave(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '请假申请',
						messageContent: '单据【' + this.businessKey + "】申请"
					}
					this.submitFormApply(response.data)
				});
			},
			//提交流程
			submitFormApply(entity) {
				let item = {
					taskId: this.taskId,
					taskVariables: this.taskVariables,
					sendMessage: this.sendMessage,
					navigateBack: 2,
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log(data, '-----data')
				this.$tab.navigateTo(
					`/components/Process/Verify?data=${data}`
				)
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

<style>

</style>
