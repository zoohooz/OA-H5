<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="标题" required name="title">
				<uni-easyinput v-model="form.title" placeholder="请输入标题" disabled />
			</uni-forms-item>
			<uni-forms-item label="紧急程度" name="urgency" required>
				<view style="display: flex;align-items: center;">
					<uni-data-select :clear="!isView" v-model="form.urgency" disabled :localdata="bs_urgency">
					</uni-data-select>
				</view>
			</uni-forms-item>
			<uni-forms-item label="申请人" name="applicant" required>
				<uni-easyinput v-model="form.applicant" disabled placeholder="请输入申请人" />
			</uni-forms-item>
			<uni-forms-item label="交接人员" required name="handoverPersonnel">
				<view style="display: flex">
					<uni-easyinput v-model="form.handoverPersonnel" disabled placeholder="请输入交接人员" />
					<button @click="userSelect" size="mini">选择</button>
				</view>
			</uni-forms-item>
			<uni-forms-item label="未完成事宜" name="unfinishedBusiness">
				<uni-easyinput  type="textarea" v-model="form.unfinishedBusiness" disabled placeholder="请输入未完成事宜" />
			</uni-forms-item>
			<uni-forms-item label="离职原因" name="dimissionCause">
				<uni-easyinput type="textarea" v-model="form.dimissionCause" disabled placeholder="请输入离职原因" />
			</uni-forms-item>


			<!-- <uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->

		</uni-forms>
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
		listDimission,
		editUs
	} from "@/api/demo/demissionApplication";
	import processAip from "@/api/workflow/processInst";
	export default {
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String // 任务id
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
					urgency: {
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
					handoverPersonnel: {
						rules: [{
							required: true,
							errorMessage: "交接人员不能为空"
						}]
					}
				},
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined
			}
		},
		methods: {
			//获取数据
			async getById() {
				let obj = {
					id: this.businessKey
				}
				const res = await listDimission(obj)
				console.log('res1=>', res.rows[0]);
				this.form = res.rows[0];
				// if (this.form.urgency == 1) {
				// 	this.form.urgency = '正常'
				// }
				// if (this.form.urgency == 2) {
				// 	this.form.urgency = '优先'
				// }
				// if (this.form.urgency == 3) {
				// 	this.form.urgency = '紧急'
				// } else {
				// 	console.log('=>', this.form.urgency);
				// }
			},
			cancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123', this.form)
			},
			/** 提交按钮 */
			submitForm() {
				listDimission(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '出差申请',
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
