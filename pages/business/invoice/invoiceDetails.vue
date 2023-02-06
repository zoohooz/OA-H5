<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="供应商名称" required name="supplierId">
				<uni-data-select v-model="form.supplierId" :disabled="isView" :localdata="informationList">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="发票号码" required name="invoiceNumber">
				<uni-easyinput v-model="form.invoiceNumber" placeholder="请输入发票号码" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="发票类型" required name="invoiceType" :disabled="true">
				<uni-easyinput v-model="form.invoiceType" placeholder="请输入发票类型" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="金额" required name="amount">
				<uni-easyinput type="number" v-model="form.amount" placeholder="请输入金额" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="税率" required name="taxRate">
				<uni-easyinput v-model="form.taxRate" placeholder="请输入税率" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="税额" required name="tax">
				<uni-easyinput v-model="form.tax" :disabled="isView" placeholder="请输入税额" />
			</uni-forms-item>
			<uni-forms-item label="价税合计" required name="valueTax">
				<uni-easyinput v-model="form.valueTax" :disabled="isView" placeholder="请输入价税合计" />
			</uni-forms-item>
			<uni-forms-item label="是否付款" required name="payment">
				<uni-data-checkbox v-model="form.payment" :localdata="sys_payment" />
			</uni-forms-item>
			<uni-forms-item label="是否认证" required name="authentication">
				<uni-data-checkbox v-model="form.authentication" :localdata="sys_authentication" />
			</uni-forms-item>
			<uni-forms-item label="收票时间" required name="ticketCollectionTime">
				<uni-datetime-picker v-model="form.ticketCollectionTime" type="datetime" v-show="!isView" />
				<span v-show="isView">{{form.ticketCollectionTime}}</span>
			</uni-forms-item>
			<uni-forms-item label="相关票据" name="filePath">
				<FileUpload @select="select" @handleView="handleView"></FileUpload>
				<span>只能上传jpg/png文件</span>
			</uni-forms-item>
			<uni-forms-item label="业务备注" name="businessRemarks">
				<uni-easyinput v-model="form.businessRemarks" :disabled="isView" placeholder="请输入业务备注" />
			</uni-forms-item>
			<!-- <uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col>
					<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->
			<view class="form_sub_button" v-if=" type!=='view' ">
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
			</view>
			<view class="form_sub_button" v-else>

				<button :params="form" @click="handleUpdate(form)" type="primary" :loading="buttonLoading">修改</button>
				<button :params="form" @click="handleDelete(form)" type="warn" :loading="buttonLoading">删除</button>
				<!-- 	<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
				 @delete="handleDelete(form)">
			</FormButton> -->
			</view>
		</uni-forms>

	</view>
</template>

<script>
	import FileUpload from "@/components/FileUpload/FileUpload.vue"
	import {
		filesUpload
	} from "@/api/demo/travel";
	import {
		listInformation,
	} from "@/api/demo/information";
	import {
		getUserProfile
	} from "@/api/system/user";
	import {
		addInvoice,
		updateInvoice,
		getInvoice,
		delInvoice
	} from "@/api/demo/invoice";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
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
		components: {
			FileUpload
		},
		data() {
			return {
				// 是否只读
				isView: false,
				informationList: [],
				// 操作类型
				type: 'add',
				// 表单参数
				form: {
					vendorName:''
				},
				// 表单校验
				rules: {
					supplierName: {
						rules: [{
							required: true,
							errorMessage: "供应商名称不能为空"
						}]
					},
					invoiceNumber: {
						rules: [{
							required: true,
							errorMessage: "发票号码不能为空"
						}]
					},
					amount: {
						rules: [{
							required: true,
							errorMessage: "金额不能为空"
						}]
					},
					taxRate: {
						rules: [{
							required: true,
							errorMessage: "税率不能为空"
						}]
					},
					tax: {
						rules: [{
							required: true,
							errorMessage: "税额不能为空"
						}]
					},
					valueTax: {
						rules: [{
							required: true,
							errorMessage: "价税合计不能为空"
						}]
					},
					payment: {
						rules: [{
							required: true,
							errorMessage: "是否付款不能为空"
						}]
					},
					invoiceType: {
						rules: [{
							required: true,
							errorMessage: "发票类型不能为空"
						}]
					},
					ticketCollectionTime: {
						rules: [{
							required: true,
							errorMessage: "收票时间不能为空"
						}]
					},
					authentication: {
						rules: [{
							required: true,
							errorMessage: "出差原因不能为空"
						}]
					},
					authentication: {
						rules: [{
							required: true,
							errorMessage: "是否认证不能为空"
						}]
					}
				},
				// 单选数据源
				sys_payment: [{
					text: '已付款',
					value: 1,
					disable: false,

				}, {
					text: '未付款',
					value: 0,
					disable: false,
				}],
				sys_authentication: [{
					text: '已认证',
					value: 1,
					disable: false,
				}, {
					text: '未认证',
					value: 0,
					disable: false,
				}],
				// 按钮加载状态
				buttonLoading: false,

				// 上传文件
				imageValue: [],
				// 回退id
				backId: undefined,

				// 上传文件回显列表、样式
				fileLists: [
					// {
					// 	url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
					// 	extname: 'png',
					// 	name: 'shuijiao.png'
					// },
				],
			}
		},
		methods: {
			// 查看图片
			handleView(e) {
				console.log('查看图片', e)
				window.open(e[0].url)
			},
			// 获取上传状态
			select({
				e
			}) {
				console.log('选择文件：', e)
				const temp = e.tempFilePaths
				filesUpload({
					filePath: temp[0],
					name: 'files'
				}).then(res => {
					console.log('文件上传成功--->', res)
					this.form.filePath = res[0]
					console.log('this.form.filePath>', this.form.filePath)
				}).catch(e => {
					this.$modal.msgError("文件上传失败!请检查文件大小及文件类型。")
				})
			},
			//获取数据
			getInvoices(id) {
				console.log('45555555555', id)
				getInvoice(id).then(response => {
					console.log('invoiceedit>', response)
					this.form = response.data
					console.log('this.form', this.form)
					// this.form.dataRange = [response.startDate, response.endDate];
					// 图片列表

					// let {
					// 	avatarFile,
					// 	fileName
					// } = response.travelFiles
					// if (avatarFile) {
					// 	let urlArr = fileName.split('.')
					// 	this.fileLists.push({
					// 		url: fileUrl(avatarFile),
					// 		extname: urlArr[urlArr.length - 1],
					// 		name: this.form.fileName,
					// 	})
					// 	console.log('fileLists-->', this.fileLists)
					// }

				});
			},
			// 修改事件
			handleUpdate(row) {
				console.log('4534534534',row)
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改发票业务'
				})
				this.getInvoices(row.invoiceId)
				this.isView = false
			},
			// 删除
			handleDelete(
				row
			) {
				console.log('4444444',row)
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + row.invoiceId + '"的数据项？').then(function() {
					that.loading = true;
					return delInvoice(row.invoiceId);
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
						this.buttonLoading = true
						let response;
						if (this.form.invoiceId != null) {
							this.backId = this.form.invoiceId
							console.log('this.form',this.form)
							response = await updateInvoice(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.$emit('refreshList')
								let that = this
								setTimeout(() => {
									that.$tab.navigateBack(1)
								}, 1000)
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
						} else {
							await getUserProfile().then(res => {
								this.form.deptId = res.data.user.deptId
								this.form.userId = res.data.user.userId
							})
							response = await addInvoice(this.form).then(response => {
								console.log('response777777777', response)
								this.backId = response.id
								this.$modal.msgSuccess("新增成功");
								this.$emit('refreshList')
								const pages = getCurrentPages();
								const currentPage = pages[pages.length - 1];
								currentPage.onClickItem({
									currentIndex: 1
								})
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
						}
					}	
				});
			},
		},
		mounted() {},
		created() {
			let queryparams = {
				pageNum: 1,
				page: 10
			}
			listInformation(queryparams).then(response => {
				this.informationList = response.rows.map(ele => {
					return {
						text: ele.vendorName,
						value: ele.id,
					}
				})
				console.log('this.informationList', this.informationList)
			});
			// 是否来自工作流表单
			if( this.isForm ){
				this.isView = true
				this.getInvoices(this.formId)
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
					title: '修改发票'
				})
				this.isView = false
				this.getInvoices(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增发票'
				})
				this.isView = false
			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看发票	'
				})
				this.isView = true
				this.getInvoices(option.id)
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
	}
</style>
