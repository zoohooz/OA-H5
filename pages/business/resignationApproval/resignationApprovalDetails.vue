<template>
	<view class="example" style="position: absolute;">
		<uni-card :is-shadow="false" is-full :title="type==='add'?'':'离职申请'" style="padding-top:5px;">
			<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
				<uni-forms-item label="标题" required name="title">
					<uni-easyinput v-model="form.title" placeholder="请输入标题" :disabled="isView" />
				</uni-forms-item>
				<uni-forms-item label="紧急程度" name="urgency" required>
					<view style="display: flex;align-items: center;">
						<uni-data-select :clear="!isView" v-model="form.urgency" :disabled="isView"
							:localdata="bs_urgency">
						</uni-data-select>
					</view>
				</uni-forms-item>
				<uni-forms-item label="申请人" name="applicant" required>
					<uni-easyinput v-model="form.applicant" disabled placeholder="请输入申请人" />
				</uni-forms-item>
				<uni-forms-item label="交接人员" required name="handoverPersonnel">
					<view style="display: flex">
						<uni-easyinput v-model="type=='add'?selectUser:form.handoverPersonnel" :disabled="isView"
							placeholder="请输入交接人员" />
						<button @click="userSelect" size="mini" :disabled="isView">选择</button>
					</view>
				</uni-forms-item>
				<uni-forms-item label="未完成事宜" name="unfinishedBusiness">
					<uni-easyinput type="textarea" v-model="form.unfinishedBusiness" :disabled="isView"
						placeholder="请输入未完成事宜" />
				</uni-forms-item>
				<uni-forms-item label="离职原因" name="dimissionCause">
					<uni-easyinput type="textarea" v-model="form.dimissionCause" :disabled="isView"
						placeholder="请输入离职原因" />
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
		addDimission,
		updateDimission,
		listId,
		delDimission
	} from "@/api/demo/demissionApplication";
	import processAip from "@/api/workflow/processInst";
	import {
		getUserProfile
	} from "@/api/system/user";
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
			selectUser: {
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
				list2:[],
				active:1,
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

				},
				// 单选数据源
				bs_urgency: [],
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
				dataObj: {},

			}
		},
		methods: {
			//获取数据
			getDetails(id) {
				console.log('45555555555', id)
				listId(id).then(response => {
					console.log('demissionEdit>', response.data)
					this.form = response.data;
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
			// 选择人员
			userSelect() {
				this.dataObj = {
					assigneeId: '101,103,104,105,106,107,1580484110112944129',
					chooseWay: 'dept',
					ids: [],
				};
				let item = {
					dataObj: this.dataObj,
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log('data', data)
				uni.navigateTo({
					url: `pages/components/user/choose-workflow-user?data=${data}`
				})
			},
			//确定选择人员
			confirmUser(userList, nodeId) {
				console.log('选择人员回调-->', userList, nodeId)
				this.form.handoverPersonnel = userList[0].nickName;
			},
			/** 提交按钮 */
			submitForm: function() {
				console.log('123', this.form)
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updateDimission(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							})
							this.sendMessage = {
								title: '离职申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						} else {
							response = await addDimission(this.form).then(response => {
								this.backId = response.data.id
								this.$modal.msgSuccess("新增成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '离职申请',
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
					processKey: "dimission", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: "com.ycyy.demo.domain.DimissionApplication",
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
					let data = encodeURIComponent(JSON.stringify(item))

					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
					return
				});
			},
			cancelProcessApply(form) {
				let row = form.actBusinessStatus
				console.log('-======', row.processInstanceId)
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(async () => {
					this.getDetails(form.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			//流程操作
			async handleUpdate(form) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改出差业务'
				})
				await this.getDetails(form.id)
				this.isView = false
			},
			// 删除
			handleDelete({
				id
			}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delDimission(id);
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
		mounted() {

		},
		created() {
			if (this.type == "add") {
				getUserProfile().then(res => {
					this.form.deptId = res.data.user.deptId
					this.form.userId = res.data.user.userId
					this.$set(this.form, 'applicant', res.data.user.nickName)
				})
				this.form.handoverPersonnel = this.selectUser
				console.log('this.selectUser==========', this.selectUser)
			}
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
				this.getDetails('created', this.formId)
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
				this.getDetails(option.id)
			} else if (type === 'add') {
				this.isView = false
			} else if (type === 'view') {
				this.isView = true
				this.getDetails(option.id)
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
	.form_sub_button{
		margin:auto;
		position: relative;
		bottom: 0;
	}
</style>
