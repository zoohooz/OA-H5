<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="申请人"  required name="applicant">
				<uni-easyinput v-model="form.applicant" placeholder="请输入申请人" disabled />
			</uni-forms-item>
			<uni-forms-item label="加班时间" required name="dateRange">
				<uni-datetime-picker v-model="form.dateRange" type="datetimerange" disabled
			 rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="加班时长(小时)" required name="overTime">
				<uni-easyinput v-model="form.overTime" disabled placeholder="请输入加班时长" />
			</uni-forms-item>
			<uni-forms-item label="加班理由" required name="reason">
				<uni-easyinput  type="textarea"  v-model="form.reason" disabled placeholder="请输入加班理由" />
			</uni-forms-item>
			
		</uni-forms>
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
		getOvertime,
	} from "@/api/demo/overtime";
	export default {
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String ,// 任务id
		},
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type: '',
				// 表单参数
				form: {},
				taskVariables: {}, //流程变量
				// 表单校验
				rules: {
					applicant: {
						rules: [{
							required: true,
							errorMessage: "加班时长不能为空"
						}]
					},
					dateRange: {
						rules: [{
							required: true,
							errorMessage: "加班时间不能为空"
						}]
					},
					overTime: {
						rules: [{
							required: true,
							errorMessage: "加班时长不能为空"
						}]
					},
					reason: {
						rules: [{
							required: true,
							errorMessage: "加班理由不能为空"
						}]
					}
				},
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
			}
		},
		methods: {
			async getById() {
				console.log('this.businessKey',this.businessKey)
				const {
					data
				} = await getOvertime(this.businessKey)
				this.form = data;
				this.form.dateRange = [data.startTime, data.endTime];
				console.log('this.form66666',this.form)
			},
			cancel() {
				uni.navigateBack({
					delta: 1
				});
			},
			/** 提交按钮 */
			submitForm() {
				getOvertime(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '加班申请',
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
		watch: {
			businessKey: {
				immediate: true, // 很重要！！！
				handler(newVal) {
					if (newVal) {
						this.getById()
					}
				}
			}
		},
		mounted() {},
		created() {},
		/*监听页面滚动*/
		onPageScroll() {},
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
