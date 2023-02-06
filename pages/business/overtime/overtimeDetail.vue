<template>
	<view class="example">
		<uni-card :is-shadow="false" is-full :title="type==='add'?'':'加班申请'" style="padding-top:5px;">
			<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
				<uni-forms-item label="申请人" required name="applicant">
					<uni-easyinput disabled v-model="form.applicant" placeholder="请输入申请人" />
				</uni-forms-item>
				<uni-forms-item label="加班时间" required name="dateRange">
					<uni-datetime-picker v-model="form.dateRange" type="datetimerange" :disabled="isView" s
						rangeSeparator="至" />
				</uni-forms-item>
				<uni-forms-item label="加班时长(小时)" required name="overTime">
					<uni-easyinput v-model="form.overTime" :disabled="isView" type="number" placeholder="请输入加班时长" />
				</uni-forms-item>
				<uni-forms-item label="加班理由" required name="reason">
					<uni-easyinput type="textarea" v-model="form.reason" :disabled="isView" placeholder="请输入加班理由" />
				</uni-forms-item>
				<view class="form_sub_button" v-if=" type!=='view' ">
					<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
				</view>

				<view class="form_sub_button" v-else>
					<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
						@cancel="cancelProcessApply(form)" @delete="handleDelete(form)">
					</FormButton>
				</view>
				<!-- <uni-row class="demo-uni-row" v-if="!isForm">
								<uni-col>
									<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
								</uni-col>
							</uni-row> -->
			</uni-forms>
		</uni-card>
		<!-- <uni-card :is-shadow="false" is-full>
			
		</uni-card> -->
		<uni-section v-if="type!=='add'" title="审批流程" type="line" padding style="margin-top: 15px;">
			<uni-steps :options="list2" active-color="#007AFF" :active="active" direction="column" />
		</uni-section>
	</view>
</template>

<script>
	import apiProcessInst from '@/api/workflow/processInst'
	import {
		addOvertime,
		updateOvertime,
		getOvertime,
		delOvertime
	} from "@/api/demo/overtime";
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
		data() {
			return {
				taskId: undefined,
				// 是否只读
				isView: false,
				// 操作类型
				type: 'add',
				// 表单参数
				form: {},
				active: 1,
				processInstanceId: '',
				list2: [],
				taskVariables: {}, //流程变量
				// 表单校验
				rules: {
					applicant: {
						rules: [{
							required: true,
							errorMessage: "申请人不能为空"
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
			//获取数据
			getOvertimes(id) {
				console.log('45555555555', id)
				getOvertime(id).then(response => {
					console.log('Overtimeedit>', response)
					this.form = response.data;
					this.form.dateRange = [response.data.startTime, response.data.endTime];
					this.processInstanceId = response.data.processInstanceId
					apiProcessInst.getHistoryInfoList(this.processInstanceId).then((res) => {
						console.log('data', res)
						let arr = res.data.reverse()
						arr.forEach((item) => {
							console.log('item', item)
							let obj = {};	
							for (let i = 0; i <= arr.length; i++) {
								obj.title = item.name + '【' + item.status + '】';
								obj.desc = item.startTime;
							}
							this.list2.push(obj);
							this.active = this.list2.length-1
						});
						console.log(this.list2);
					})

				})

			},
			/** 新增按钮操作 */
			handleAdd() {
				uni.navigateTo({
					url: `/pages/business/overtime/overtimeDetail?type=add`
				});
			},
			// 修改事件
			handleUpdate(row) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改加班业务'
				})
				this.getOvertimes(row.id)
				this.isView = false
			},
			//撤回
			cancelProcessApply(row) {
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(() => {
					this.getOvertimes(row.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			// 删除
			handleDelete({
				id
			}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delOvertime(id);
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
					if (!valid) {
						({
								0: this.form.startTime,
								1: this.form.endTime
							} =
							this.form.dateRange);
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updateOvertime(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '加班申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						} else {
							response = await addOvertime(this.form).then(response => {
								this.backId = response.id
								this.$modal.msgSuccess("新增成功");
								return response
								debugger;
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '加班申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						}
					}
				});
			},
			submitFormApply(entity) {
				console.log('21121212', entity)
				let variables = {
					entity: entity,
				};
				const data = {
					processKey: "overtime", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: "com.ycyy.demo.domain.OvertimeApplicatlon",
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
					this.form.deptId = res.data.user.deptId
					this.form.userId = res.data.user.userId
					this.$set(this.form, 'applicant', res.data.user.nickName)
				})
			}

			// 是否来自工作流表单
			if (this.isForm) {
				this.isView = true
				this.getOvertimes(this.formId)
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
				// uni.setNavigationBarTitle({
				// 	title: '修改加班申请'
				// })
				this.isView = false
				this.getOvertimes(option.id)
			} else if (type === 'add') {
				// uni.setNavigationBarTitle({
				// 	title: '新增加班申请'
				// })
				this.isView = false
			} else if (type === 'view') {
				// uni.setNavigationBarTitle({
				// 	title: '查看加班申请'
				// })
				this.isView = true
				this.getOvertimes(option.id)
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
	// .form_sub_button{
	// 	margin:auto;
	// 	position: relative;
	// }
</style>
