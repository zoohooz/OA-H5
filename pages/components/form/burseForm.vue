<template>
	<view>
		<burseDetail :isForm='true' :formId="businessKey"></burseDetail>
		<!-- 操作按钮 -->
		<uni-row class="demo-uni-row example formButtom bottom_button" :gutter="10">
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
	import { getReimburse } from "@/api/demo/reimburse";
	import burseDetail from '@/pages/business/reimburse/burseDetail.vue'
	export default {
		name: 'burseForm',
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String // 任务id
		},
		components: {
			burseDetail
		},
		data() {
			return {
				// 按钮loading
				buttonLoading: false,
				// 遮罩层
				loading: true,
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
			/** 提交按钮 */
			submitForm() {
				getReimburse(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '报销申请',
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
	.bottom_button{
		position: fixed;
		bottom: 2px;
		width: 100%;
		padding-right: 20px;
	}

</style>