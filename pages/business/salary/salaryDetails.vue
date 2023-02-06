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
				<uni-easyinput disabled v-model="form.department" placeholder="请输入所属部门" />
			</uni-forms-item>
			<uni-forms-item label="职务" required name="office">
				<uni-easyinput :disabled="form.office?true:false" v-model="form.office" placeholder="请输入职务" />
			</uni-forms-item>
			<uni-forms-item label="入职时间" required name="onboardingTime">
				<uni-datetime-picker v-model="form.onboardingTime" type="date" :disabled="isView" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="调整前薪资" required name="salaryBeforeAdjustment">
				<uni-easyinput :disabled="isView" type="number" v-model="form.salaryBeforeAdjustment" placeholder="请输入调整前薪资" />
			</uni-forms-item>
			<uni-forms-item label="调整后薪资" required name="adjustedSalary">
				<uni-easyinput :disabled="isView" type="number" v-model="form.adjustedSalary" placeholder="请输入调整后薪资" />
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
			<view class="form_sub_button" v-if=" type!=='view' ">
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
			</view>

			<view class="form_sub_button" v-else>
				<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
					@cancel="cancelProcessApply(form)" @delete="handleDelete(form)">
				</FormButton>
			</view>

		</uni-forms>
	</view>
</template>

<script>
	import {
		addSalary,
		updateSalary,
		getSalary,
		delSalary
	} from "@/api/demo/salary";
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
	import {
		getUserProfile
	} from "@/api/system/user";
	import processAip from "@/api/workflow/processInst";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
	export default {
		props: {
			isForm: {
				type: Boolean,
				default: false
			},
			formId: {
				type: String,
				default: ''
			},
		},
		components: {
			DeptSelect
		},
		data() {
			return {
				taskId: undefined,
				// 是否只读
				isView: false,
				// 操作类型
				type: 'add',
				// 表单参数
				form: {},
				processInstanceId: '',
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
				// 部门回显名称 暂时没有数回显选择
				deptLabel: ''
			}
		},
		methods: {
			//获取数据
			getSalarys(id) {
				console.log('45555555555', id)
				getSalary(id).then(response => {
					console.log('Overtimeedit>', response)
					this.form = response.data;
				});
			},
			confirm(e) {
				this.form.deptId = e[0].id
				this.form.department = e[0].label
			},
			// 修改事件
			handleUpdate(row) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改涨薪申请'
				})
				this.getSalarys(row.id)
				this.isView = false
			},
			//撤回
			cancelProcessApply(row) {
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(() => {
					this.getSalarys(row.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			// 删除
			handleDelete({
				id
			}) {
				console.log('333333333', id)
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delSalary(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					setTimeout(() => {
						that.$tab.navigateBack(1)
					}, 1000)
				}).catch(() => {
					that.loading = false;
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123', this.form)
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					this.buttonLoading = true
					let response;
					if (this.form.id != null) {
						this.backId = this.form.id
						response = await updateSalary(this.form).then(response => {
							this.$modal.msgSuccess("修改成功");
							return response
						}).finally(() => {
							this.buttonLoading = false;
						});
						this.sendMessage = {
							title: '涨薪申请',
							messageContent: '单据【' + response.data.id + "】申请"
						}
						this.submitFormApply(response.data)
					} else {
						response = await addSalary(this.form).then(response => {
							// this.backId = response.id
							this.$modal.msgSuccess("新增成功");
							return response
						}).finally(() => {
							this.buttonLoading = false;
						});
						this.sendMessage = {
							title: '涨薪申请',
							messageContent: '单据【' + response.data.id + "】申请"
						}
						this.submitFormApply(response.data)
					}
				});
			},
			submitFormApply(entity) {
				console.log('21121212', entity)
				let variables = {
					entity: entity,
				};
				const data = {
					processKey: "salary", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: "com.ycyy.demo.domain.RoseMoneyApplication",
				};
				processAip.startProcessApply(data).then((response) => {
					console.log("流程-->22222", response);
					this.taskId = response.data.taskId;
					// 查询下一节点的变量
					this.taskVariables = {
						entity: entity, // 变量
						userId: "1",
					};
					let item = {
						taskId: this.taskId,
						taskVariables: this.taskVariables,
						sendMessage: this.sendMessage,
						navigateBack: this.type == 'add' ? 1 : 2
					}
					let data = encodeURIComponent(JSON.stringify(item))

					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
					return
				});
			},
			// 流程取消
			verifyCancel() {
				console.log('流程取消了')
				fallbackUserDays(this.backId).then(() => {
					this.getLeaveData(this.backId)
					this.backId = undefined
				})
			},
		},
		mounted() {},
		created() {
			if (this.type == 'add') {
				getUserProfile().then(res => {
					this.form.userId = res.data.user.userId;
					this.form.department = res.data.roleGroup
					this.form.office = res.data.postGroup
					this.$set(this.form, "applicant", res.data.user.nickName);
					this.$set(this.form, "userId", res.data.user.userId);
					this.$set(this.form, "department",res.data.roleGroup);
					this.$set(this.form, "office", res.data.postGroup);
				})
			}
			// 是否来自工作流表单
			if (this.isForm) {
				this.isView = true
				this.getSalarys(this.formId)
			}
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad: function(option) {
			console.log('option-->', option)
			let {
				type
			} = option
			this.type = type
			if (type === 'edit') {
				uni.setNavigationBarTitle({
					title: '修改涨薪申请'
				})
				this.isView = false
				this.getSalarys(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增涨薪申请'
				})
				this.isView = false
			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看涨薪申请'
				})
				this.isView = true
				this.getSalarys(option.id)
			}

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


<style lang="scss" scoped>
	.form_sub_button {
		margin: auto;
		position: relative;
	}
</style>
