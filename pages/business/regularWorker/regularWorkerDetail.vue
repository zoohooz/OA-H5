<template>
	<view class="example" style="position: absolute;">

		<uni-card :is-shadow="false" is-full :title="type==='add'?'':'转正申请'" style="padding-top:5px;">
			<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

				<uni-forms-item label="标题" required name="duration">
					<uni-easyinput v-model="form.title" placeholder="请输入标题" :disabled="isView" />
				</uni-forms-item>
				<uni-forms-item label="紧急程度" required name="urgency">
					<view style="display: flex;align-items: center;">
						<uni-data-select :clear="!isView" v-model="form.urgency" :localdata="bs_urgency"
							:disabled="isView">
						</uni-data-select>
					</view>
				</uni-forms-item>
				<uni-forms-item label="申请人" required name="applicant">
					<uni-easyinput v-model="form.applicant" disabled placeholder="请输入申请人" />
				</uni-forms-item>
				<uni-forms-item label="日期" required name="dateRange">
					<uni-datetime-picker v-model="form.dateRange" type="datetimerange" :disabled="isView"
						rangeSeparator="至" />
				</uni-forms-item>
				<uni-forms-item label="实习心得" name="internshipExperience">
					<uni-easyinput type="textarea" v-model="form.internshipExperience" :disabled="isView"
						placeholder="请输入实习心得" />
				</uni-forms-item>
				<uni-forms-item label="岗位理解" name="dutyUnderstanding">
					<uni-easyinput type="textarea" v-model="form.dutyUnderstanding" placeholder="请输入岗位理解"
						:disabled="isView" />
				</uni-forms-item>
				<uni-forms-item label="未来发展" name="howBetter">
					<uni-easyinput type="textarea" v-model="form.howBetter" placeholder="请输入未来发展" :disabled="isView" />
				</uni-forms-item>
				<uni-forms-item label="建议及意见" name="companyAdvice">
					<uni-easyinput type="textarea" v-model="form.companyAdvice" placeholder="请输入建议及意见"
						:disabled="isView" />
				</uni-forms-item>
				
				<!-- 
			<uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col>
					<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->
			
			</uni-forms>
		</uni-card>
		<uni-section v-if="type!=='add'" title="审批流程" type="line" padding style="margin-top: 15px;">
			<uni-steps :options="list2" active-color="#007AFF" :active="active" direction="column" />
		</uni-section>
		<view class="form_sub_button" v-if=" type!=='view' ">
			<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
		</view>
		<view class="form_sub_button" v-else>
			<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
				@cancel="cancelProcessApply(form)" @delete="handleDelete(form)">
			</FormButton>
		</view>
	</view>
</template>

<script>
	import apiProcessInst from '@/api/workflow/processInst'
	import {
		addInformation,
		updateInformation,
		getInformation,
		delInformation
	} from "@/api/demo/regularWorker";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
	import {
		getUserProfile
	} from "@/api/system/user";
	import processAip from "@/api/workflow/processInst";
	export default {
		props: {
			isForm: {
				type: Boolean,
				default: false
			},
			formId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type: 'add',
				// 表单参数
				form: {},
				list2: [],
				active:1,
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
				// 单选数据源
				bs_urgency: [],
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
			}
		},
		methods: {
			//获取数据
			getInformations(id) {
				console.log('45555555555', id)
				getInformation(id).then(response => {
					console.log('traveledit>', response)
					this.form = response.data;
					this.form.dateRange = [response.data.startDate, response.data.positiveDate]
					this.form.urgency = JSON.stringify(response.data.urgency)
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
				});
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123', this.form)
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.form.startDate = this.form.dateRange[0];
						this.form.positiveDate = this.form.dateRange[1];
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updateInformation(this.form).then(response => {
								console.log('response', response)
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '转正申请',
								messageContent: '单据【' + response.id + "】申请"
							}
							this.submitFormApply(response.data)
						} else {
							response = await addInformation(this.form).then(response => {
								// this.backId = response.id
								this.$modal.msgSuccess("新增成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '转正申请',
								messageContent: '单据【' + response.id + "】申请"
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
					processKey: "regularWorker", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: "com.ycyy.demo.domain.RegularWorker",
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
						navigateBack: this.type == 'add' ? 1 : 2,
					}
					console.log('============item', item)
					let data = encodeURIComponent(JSON.stringify(item))

					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
					return
				});
			},
			// 修改事件
			handleUpdate(row) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改转正申请'
				})
				this.getInformations(row.id)
				this.isView = false
			},
			//撤回
			cancelProcessApply(row) {
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(async () => {
					this.getInformations(row.id)
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
					return delInformation(id);
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
		},
		mounted() {},
		created() {
			if (this.type == 'add') {
				getUserProfile().then((res) => {
					this.form.userId = res.data.user.userId
					this.form.deptId = res.data.user.deptId
					this.$set(this.form, 'applicant', res.data.user.nickName)
				});
			}
			// if (this.status === "edit") {
			//      this.form = this.formData;
			//      this.form.dateRange = [this.form.startDate, this.form.positiveDate];
			//    } else {

			//    }
			this.$getDicts("bs_urgency").then(res => {
				this.bs_urgency = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue,
					}
				});
				console.log('this.bs_urgency', this.bs_urgency)
			});
			// 是否来自工作流表单
			if (this.isForm) {
				this.isView = true
				this.getInformations(this.formId)
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
				this.isView = false
				this.getInformations(option.id)
			} else if (type === 'add') {
				this.isView = false
			} else if (type === 'view') {
				this.isView = true
				this.getInformations(option.id)
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
		bottom: 0;
	}
</style>
