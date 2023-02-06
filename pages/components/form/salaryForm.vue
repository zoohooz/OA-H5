<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="申请人" required name="applicant">
				<uni-easyinput disabled v-model="form.applicant" placeholder="请输入申请人" />
			</uni-forms-item>
			<uni-forms-item label="学历" required name="degree">
				<uni-easyinput :disabled="isView" v-model="form.degree" placeholder="请输入学历" />
			</uni-forms-item>
			<uni-forms-item label="毕业时间" required name="graduationTime">
				<uni-datetime-picker v-model="form.graduationTime" type="date" :disabled="isView" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="所属部门" required>
				<uni-easyinput disabled v-model="form.department" placeholder="所属部门" />
			</uni-forms-item>
			<uni-forms-item label="职务" required name="office">
				<uni-easyinput disabled v-model="form.office" placeholder="请输入职务" />
			</uni-forms-item>
			<uni-forms-item label="入职时间" required name="onboardingTime">
				<uni-datetime-picker v-model="form.onboardingTime" type="date" :disabled="isView" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="调整前薪资" required name="salaryBeforeAdjustment">
				<uni-easyinput :disabled="isView" v-model="form.salaryBeforeAdjustment" placeholder="请输入调整前薪资" />
			</uni-forms-item>
			<uni-forms-item label="调整后薪资" required name="adjustedSalary">
				<uni-easyinput :disabled="isView" v-model="form.adjustedSalary" placeholder="请输入调整后薪资" />
			</uni-forms-item>
			<uni-forms-item label="执行时间" required name="executionDate">
				<uni-datetime-picker v-model="form.executionDate" type="date" :disabled="isView" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="自我评价" name="selfEvaluation">
				<uni-easyinput type="textarea" :disabled="isView" v-model="form.selfEvaluation" placeholder="请输入自我评价" />
			</uni-forms-item>
			<uni-forms-item label="项目部评价" name="ministryEvaluation">
				<uni-easyinput type="textarea" :disabled="isView" v-model="form.ministryEvaluation"
					placeholder="请输入项目部评价" />
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
		getSalary,
		successSalary
	} from "@/api/demo/salary";
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
	export default {
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String, // 任务id
		},
		components: {
			DeptSelect
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
							errorMessage: "申请人不能为空"
						}]
					},
					degree: {
						rules: [{
							required: true,
							errorMessage: "学历不能为空"
						}]
					},
					graduationTime: {
						rules: [{
							required: true,
							errorMessage: "毕业时间不能为空"
						}]
					},
					office: {
						rules: [{
							required: true,
							errorMessage: "职务不能为空"
						}]
					}
				},
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
				deptLabel: ''
			}
		},
		methods: {
			async getById() {
				console.log('this.businessKey', this.businessKey)
				const {
					data
				} = await getSalary(this.businessKey)
				this.form = data;
				this.form.dateRange = [data.startTime, data.endTime];
				console.log('this.form66666', this.form)
			},
			cancel() {
				uni.navigateBack({
					delta: 1
				});
			},
			confirm(e) {
				this.form.deptId = e[0].id
				this.form.department = e[0].label
			},
			/** 提交按钮 */
			submitForm() {
				getSalary(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '涨薪申请',
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
					type: 'salary',
					userId: this.form.userId,
					salary: this.form.adjustedSalary
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log(data, '-----data')
				this.$tab.navigateTo(
					`/components/Process/Verify?data=${data}`
				)
			}
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
