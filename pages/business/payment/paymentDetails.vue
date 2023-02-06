<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="供应商名称" required name="supplierId">
				<uni-data-select v-model="form.supplierId" :disabled="isView"
					:localdata="informationLists" @change="handleSelect">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="费用金额" required name="costAmount">
				<uni-easyinput type="number" v-model="form.costAmount" placeholder="请输入费用金额" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="付款用途" required name="paymentPurpose" :disabled="true">
				<uni-easyinput v-model="form.paymentPurpose" placeholder="请输入付款用途" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="是否收到发票" required name="whetherReceive" :disabled="true">
				<uni-data-checkbox v-model="form.whetherReceive" :localdata="sys_done" />
			</uni-forms-item>
			<uni-forms-item label="付款时间" required name="paymentTime">
				<uni-datetime-picker v-model="form.paymentTime" type="datetime" :disabled="isView" rangeSeparator="至" />
			</uni-forms-item>
			<uni-forms-item label="备注" name="comment">
				<uni-easyinput type="textarea" v-model="form.comment" :disabled="isView" placeholder="请输入备注" />
			</uni-forms-item>
		</uni-forms>
		<uni-section title="报销明细" type="line" style="margin-top:13px;">
			<uni-table ref="tableData" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">发票号码</uni-th>
					<uni-th align="center">发票面值</uni-th>
					<uni-th align="center"><span style="color:red">*</span>已付款</uni-th>
					<uni-th align="center" width="80">未付款</uni-th>
					<uni-th align="center">相关票据</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center">{{ item.invoiceNumber }}</uni-td>
					<uni-td align="center">{{ item.faceValue }}</uni-td>
					<uni-td align="center" :required="{label:'已付款',prop:'paymentHasBeen'}">
						<uni-easyinput v-model="item.paymentHasBeen" v-show="!isView" type="number"
							:disabled="isView" />
						<span v-show="isView">{{item.paymentHasBeen}}</span>
					</uni-td>
					<uni-td align="center">{{ item.amount }}</uni-td>
					<uni-td align="center">
						<view class="uni-group" v-if="item.filePath">
							<button class="uni-button" size="mini" @click="Download(item,false)"
								style="margin-right: 3px;">下载</button>
							<button class="uni-button" size="mini" @click="filePre(item)">查看</button>
						</view>
						<span v-else>暂无票据</span>
					</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<button class="uni-button" size="mini" @click="remove(item)" :disabled="isView" >删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
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
	import {
		addPayment,
		updatePayment,
		getPayment,
		delPayment,
		supplierList,
		fallbackPayment
	} from "@/api/demo/payment";
	import {
		listInformation
	} from "@/api/demo/information";
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
				loading: true,
				// 是否只读
				isView: false,
				// 操作类型
				type: 'add',
				// 表单参数
				form: {},
				supplierLists: [],
				// 表单校验
				rules: {
					supplierName: {
						rules: [{
							required: true,
							errorMessage: "供应商不能为空"
						}]
					},
					costAmount: {
						rules: [{
							required: true,
							errorMessage: "费用金额不能为空"
						}]
					},
					paymentPurpose: {
						rules: [{
							required: true,
							errorMessage: "付款用途不能为空"
						}]
					},
					paymentTime: {
						rules: [{
							required: true,
							errorMessage: "付款时间不能为空"
						}]
					}
				},
				// 单选数据源
				sys_done: [{
					text: '已收到',
					value: 1,
					disable: false,
				}, {
					text: '未收到',
					value: 0,
					disable: false,
				}],
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
				tableData: [],
				// 供应商
				informationList: [],
				supplierId: '',
				supplierName: '',
				informationLists: []
			}
		},
		methods: {
			//获取数据
			getPayments(id) {
				console.log('45555555555', id)
				getPayment(id).then(response => {
					console.log('traveledit>', response)
					this.form = response.data;
					this.tableData = this.form.paymentRecordsList
					this.form.supplierName = response.data.supplierName
				});
			},
			// notPaying(){
			// 				console.log('this.tableData',this.tableData)
			// 				let sum = Number(item.amount) - Number(value)
			// 	            item[bind] = value || value == 0 ? value : null;
			// 	            if(sum >= 0 ){
			// 	              item.notPaying = sum
			// 	            }else{
			// 	              item.notPaying = item.amount
			// 	              this.$message.error("付款金额不能大于发票金额！");
			// 	              item.paymentHasBeen = undefined
			// 	            }
			// },
			selectionChange() {
				// this.ids = e.detail.index.map(item => {
				// 	return this.leaveList[item].id
				// })
				// console.log('ids==>', this.ids)
			},
			change(e) {
				console.log('6666', e)
			},
			remove(row) {
				console.log('row', row.id)
				this.tableData.splice(row.id);
			},
			filePre(item) {
				let url = fileUrl(item.filePath)
				window.open(url)
			},
			Download(e,isImage) {
				console.log('8888888',e)
				let data = JSON.parse(JSON.stringify(e))
				let path = e.filePath
				 if(isImage == true){
				        this.download('demo/reimbursement/download/', {
				          'filePath' : path
				        }, e.fileName,isImage).then(blob =>{
				          data.imageUrl = window.URL.createObjectURL(blob)
				          this.$set(this.tableData,e.$index,data) 
				        })
				      }else{
				        this.download('demo/reimbursement/download/', {
				          'filePath' : path
				        }, e.fileName)
				      }
			},
			handleSelect(id) {
				this.supplierId = id
				this.informationList.map((item => {
					console.log('item66666666', item)
					if (item.id === id) {
						this.supplierName = item.value
						this.tableData = item.list
					}
				}))
				// this.notPaying()
			},
			// 修改事件
			handleUpdate(row) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改付款跟踪单'
				})
				this.getPayments(row.id)
				this.isView = false
			},
			//撤回
			cancelProcessApply(row) {
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(() => {
					this.getPayments(row.id);
					this.$modal.msgSuccess("撤回成功");
				}).finally(() => {
					this.loading = false;
				});
			},
			// 删除
			handleDelete({id}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delPayment(id);
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
			/** 提交按钮 */
			async submitForm() {
				console.log('123', this.form)
				this.$refs.form.validate(async valid => {
					console.log('valid--->', valid, Boolean(!valid))
					if (!valid) {
						this.buttonLoading = true
						let response;
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updatePayment(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '付款追踪申请',
								messageContent: '单据【' + response.data.id + "】申请"
							}
							this.submitFormApply(response.data)
						} else {
							await getUserProfile().then(res => {
								this.form.deptId = res.data.user.deptId
								this.form.userId = res.data.user.userId
								this.$set(this.form, 'name', res.data.user.userName)
							})
							this.tableData.forEach(item => {
								Object.assign(item, {
									notPaying: Number(item
										.amount) - Number(item
										.paymentHasBeen)
								})
							})
							this.form.paymentRecordsList = this.tableData
							this.form.supplierId = this.supplierId
							this.form.supplierName = this.supplierName ? this.supplierName :
								this.form
								.supplierName
							response = await addPayment(this.form).then(response => {
								this.backId = response.id
								this.$modal.msgSuccess("新增成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
							this.sendMessage = {
								title: '付款追踪申请',
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
					processKey: "payment", // key
					businessKey: entity.id, // 业务id
					variables: variables,
					classFullName: 'com.ycyy.demo.domain.SysPaymentSchedule',
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
		},
		mounted() {},
		created() {
			this.form = JSON.parse(JSON.stringify(this.form));
			console.log('this.form.paymentRecordsList', this.form)
			supplierList().then(res => {
				console.log('供应商展示',res)
				this.informationList = res.data.map(ele => {
					return {
						"value": ele.vendorName,
						"id": ele.id,
						'list': ele.listInvoice,
					}
				})
				this.informationLists = res.data.map(ele => {
					return {
						text: ele.vendorName,
						value: ele.id
					}
				})
				console.log('this.informationLists',this.informationLists)
			})
			// listInformation(queryparams).then(response => {
			// 	console.log('供应商==>', response.rows)
			// 	this.supplierLists = response.rows.map(ele => {
			// 		return {
			// 			text: ele.vendorName,
			// 			value: ele.id,
			// 			disable: false,
			// 		}
			// 	})
			// });
			console.log('this.tableData', this.tableData)
			if (this.tableData.length != 0) {
				this.loading = true
			} else {
				this.loading = false
			}
			let queryparams = {
				pageNum: 1,
				page: 10
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
					title: '修改付款追踪单'
				})
				this.isView = false
				this.getPayments(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增付款追踪单'
				})
				this.isView = false
			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看付款追踪单'
				})
				this.isView = true
				this.getPayments(option.id)
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


<style>

</style>
