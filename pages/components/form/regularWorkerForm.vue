<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="标题" required name="duration">
				<uni-easyinput v-model="form.title" placeholder="请输入标题" disabled />
			</uni-forms-item>
			<uni-forms-item label="紧急程度" required name="urgency">
				<view style="display: flex;align-items: center;">
					<uni-data-select :clear="!isView" v-model="form.urgency" :localdata="bs_urgency" disabled>
					</uni-data-select>
				</view>
			</uni-forms-item>
			<uni-forms-item label="申请人" required name="applicant" :disabled="true">
				<uni-easyinput v-model="form.applicant" placeholder="请输入申请人" disabled />
			</uni-forms-item>
			<uni-forms-item label="日期" required name="dateRange">
				<uni-datetime-picker v-model="form.dateRange" type="datetimerange" disabled rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="实习心得" name="internshipExperience">
				<uni-easyinput type="textarea" v-model="form.internshipExperience" disabled placeholder="请输入实习心得" />
			</uni-forms-item>
			<uni-forms-item label="岗位理解" name="dutyUnderstanding">
				<uni-easyinput type="textarea" v-model="form.dutyUnderstanding" placeholder="请输入岗位理解" disabled />
			</uni-forms-item>
			<uni-forms-item label="未来发展" name="howBetter">
				<uni-easyinput type="textarea" v-model="form.howBetter" placeholder="请输入未来发展" disabled />
			</uni-forms-item>
			<uni-forms-item label="建议及意见" name="companyAdvice">
				<uni-easyinput type="textarea" v-model="form.companyAdvice" placeholder="请输入建议及意见" disabled />
			</uni-forms-item>
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
			<!-- 
			<uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->

		</uni-forms>


	</view>
</template>

<script>
	import {
		getInformation,
		editUs
	} from "@/api/demo/regularWorker";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
	import processAip from "@/api/workflow/processInst";
	export default {
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String, // 任务id
		},
		data() {
			return {
				bs_urgency: [],
				// 是否只读
				isView: false,
				// 操作类型
				type: '',
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					title: {
						rules: [{
							required: true,
							errorMessage: "标题不能为空"
						}]
					},
					status: {
						rules: [{
							required: true,
							errorMessage: "紧急程度不能为空"
						}]
					},
					applicant: {
						rules: [{
							required: true,
							errorMessage: "申请人不能为空"
						}]
					},
					dataRange: {
						rules: [{
							required: true,
							errorMessage: "日期不能为空"
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
			//获取数据
			async getById() {
				console.log('this.businessKey', this.businessKey)
				const {
					data
				} = await getInformation(this.businessKey)
				console.log('======data', data)
				this.form = data;
				this.form.dateRange = [data.startDate, data.positiveDate]
				this.form.urgency = JSON.stringify(data.urgency)
			},
			cancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			/** 提交按钮 */
			submitForm() {
				getInformation(this.businessKey).then(response => {
					console.log('response', response)
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '转正申请',
						messageContent: '单据【' + this.businessKey + "】申请"
					}
					this.submitFormApply(response.data)
					editUs(this.form.userId).then((resp) => {
						console.log('editUs=>', resp);
					});
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
		created() {
			this.$getDicts("bs_urgency").then(res => {
				this.bs_urgency = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue,
					}
				});
				console.log('this.bs_urgency', this.bs_urgency)
			});
			// this.getInformations('created', this.formId)

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad: function(option) {
			console.log('option-->', option)
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
