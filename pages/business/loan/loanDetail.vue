<template>
	<view class="example form_detail">
		<uni-forms class="form" :modelValue="form" ref="form" :rules="rules" label-width='106px' label-align='right'>

			<uni-forms-item label="申请人" required name="name">
				<uni-easyinput v-model="form.name" placeholder="请输入申请人" disabled />
			</uni-forms-item>
			<uni-forms-item label="借款金额" required name="loanMoney">
				<uni-easyinput v-model="form.loanMoney" type="number" placeholder="请输入借款金额" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="借款方式" required name="mode">
				<!-- <uni-easyinput  v-model="form.mode" placeholder="请选择借款方式" :disabled="isView" /> -->
				<uni-data-select :disabled="isView" :clear="!isView" v-model="form.mode" :localdata="bs_burse_type">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="收款人手机号" required name="telephone">
				<uni-easyinput v-model="form.telephone" placeholder="请输入收款人手机号" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="借款时间" required name="loanDate">
				<uni-datetime-picker v-model="form.loanDate" type="datetime" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="还款时间" required name="returnDate">
				<uni-datetime-picker v-model="form.returnDate" type="datetime" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="开户行" required name="deposit">
				<uni-easyinput v-model="form.deposit" placeholder="请输入开户行" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="银行账户" required name="card">
				<uni-easyinput v-model="form.card" type="number" placeholder="请输入银行账户" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="备注" required name="remarks">
				<uni-easyinput type="textarea" v-model="form.remarks" placeholder="请输入备注" :disabled="isView" />
			</uni-forms-item>


			<!-- <uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">确定</button>
				</uni-col>
			</uni-row> -->
			<view v-show="!isForm">
				<view class="form_sub_button" v-if=" type!=='view' ">
					<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
				</view>
				
				<view class="form_sub_button" v-else>
					<FormButton 
						:params="form" 
						:status="form.actBusinessStatus" 
						@update="handleUpdate(form)"
						@cancel="cancelProcessApply(form)" 
						@delete="handleDelete(form)">
					</FormButton>
				</view>
			</view>

		</uni-forms>
	</view>
</template>

<script>
	import { getUserProfile } from "@/api/system/user";
	import processAip from "@/api/workflow/processInst";
	import { getLoan, addLoan, updateLoan } from "@/api/demo/loan";
	import { checkPhone } from "@/utils/burse";
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
		components: {},
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type: 'add',
				// 表单参数
				form: {},
				buttonLoading: false,

				// 表单校验
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "申请人不能为空！"
						}]
					},
					loanMoney: {
						rules: [{
							required: true,
							errorMessage: "借款金额不能为空！"
						}]
					},
					mode: {
						rules: [{
							required: true,
							errorMessage: "借款方式不能为空！"
						}]
					},
					telephone: {
						rules: [{
							required: true,
							errorMessage: "联系电话不能为空",
							validateFunction: (rule, value, data, callback) => checkPhone(rule, value, data,
								callback)
						}]
					},
					loanDate: {
						rules: [{
							required: true,
							errorMessage: "借款时间不能为空！"
						}]
					},
					returnDate: {
						rules: [{
							required: true,
							errorMessage: "还款时间不能为空！"
						}]
					},
					deposit: {
						rules: [{
							required: true,
							errorMessage: "开户行不能为空！"
						}]
					},
					card: {
						rules: [{
							required: true,
							errorMessage: "银行账户不能为空！"
						}]
					}
				},

				bs_burse_type: [], //报销方式

				// 工作流
				processInstanceId: '', // 流程实例
				taskVariables: {}, //流程变量
				taskId: undefined, //任务id
				sendMessage: {}, // 消息提醒

			}
		},
		methods: {
			getLoanData(id) {
				getLoan(id).then(resp => {
					this.form = resp.data;
					this.processInstanceId = resp.data.processInstanceId
				});
			},
			// 取消
			cancle() {
				this.$tab.navigateBack(1)
			},
			/** 提交按钮 */
			submitForm: function() {
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.buttonLoading = true
						let response;
						if (this.form.loanId != null) {
							response = await updateLoan(this.form).then(resp => {
								this.$modal.msgSuccess("修改成功");
								return resp
							}).finally(() => {
								this.buttonLoading = false;
							});
						} else {
							response = await addLoan(this.form).then(resp => {
								this.$modal.msgSuccess("新增成功");
								this.form.loanId = resp.loanId
								return resp
							}).finally(() => {
								this.buttonLoading = false;
							});
						}

						this.sendMessage = {
							title: '借款申请',
							messageContent: '单据【' + response.loanId + "】申请"
						}
						this.submitFormApply(response)
					}
				});
			},
			//提交流程
			submitFormApply(entity) {
				let variables = {
					entity: entity
				}
				const data = {
					processKey: 'loan', // key
					businessKey: entity.loanId, // 业务id
					variables: variables,
					classFullName: 'com.ycyy.demo.domain.Loan'
				}
				// 启动流程
				processAip.startProcessApply(data).then(response => {
					this.taskId = response.data.taskId;
					// 查询下一节点的变量
					this.taskVariables = {
						entity: entity, // 变量
						userId: '1',
					}

					let item = {
						taskId: this.taskId,
						taskVariables: this.taskVariables,
						sendMessage: this.sendMessage,
						navigateBack: this.type == 'add' ? 1 : 2,
					}
					console.log(item, '-----item')
					let data = encodeURIComponent(JSON.stringify(item))

					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
				})
			},
			// 流程取消
			verifyCancel() {
				console.log('流程取消了')
			},
			
			//流程操作
			async handleUpdate(form){
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title:'修改借款业务'
				})
				await this.getLoanData(form.loanId)
				this.isView = false
			},
			cancelProcessApply(form){
				let row = form.actBusinessStatus
			  this.$modal.confirm('是否撤销申请').then(() => {
			    this.loading = true;
			    return processAip.cancelProcessApply(row.processInstanceId);
			  }).then(async() => {
			    this.getLoanData(form.loanId)
			    this.$modal.msgSuccess("撤回成功");
			  })
				.finally(() => {
			    this.loading = false;
			  });
			},
			// 删除
			handleDelete({loanId}){
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + loanId + '"的数据项？').then(function() {
					that.loading = true;
					return delLoan(loanId);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					setTimeout(() =>{
						that.$tab.navigateBack(1)
					},1000)
				}).catch(() => {
					that.loading = false;
				});
			},
			
			
		},
		mounted() {},
		async created() {
			// 获取部门id
			if(this.type == 'add'){
				console.log('getUserProfile')
				this.form.mode = '1'
				getUserProfile().then(res =>{
					console.log('getUserProfile==>',res)
					this.form.deptId = res.data.user.deptId
					this.form.userId  = res.data.user.userId
					this.form.name = res.data.user.nickName
					this.$set(this.form,'name',res.data.user.nickName)
				})
			}
			
			let bs_burse_typeList = await this.$getDictsList('bs_burse_type')
			this.bs_burse_type = bs_burse_typeList.filter(ele => {
				return ele.text == '工资卡' || ele.text == '现金'
			})
			
			// 是否来自工作流表单
			if( this.isForm ){
				this.isView = true
				this.getLoanData(this.formId)
			}
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('option-->', option)
			let {
				type
			} = option
			this.type = type
			if (type === 'edit') {
				uni.setNavigationBarTitle({
					title: '修改借款申请'
				})
				this.getLoanData(option.id)

			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '添加借款申请'
				})

				this.form.mode = '1'
				// 获取部门id
				getUserProfile().then(res => {
					this.form.deptId = res.data.user.deptId
					this.form.userId = res.data.user.userId
					this.$set(this.form, 'name', res.data.user.nickName)
				})

			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看借款申请'
				})
				this.getLoanData(option.id)
				this.isView = true
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

<style scoped lang="scss">

</style>
