<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="供应商名称" required name="vendorName">
				<uni-easyinput v-model="form.vendorName" placeholder="请输入供应商名称" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="联系人" required name="contact">
				<uni-easyinput v-model="form.contact" placeholder="请输入联系人" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="电话" required name="contactDetails">
				<uni-easyinput v-model="form.contactDetails" placeholder="请输入电话" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="邮箱" required name="mailbox">
				<uni-easyinput v-model="form.mailbox" placeholder="请输入邮箱" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="开户名" required name="accountName">
				<uni-easyinput v-model="form.accountName" placeholder="请输入开户名" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="开户支行" required name="deposit">
				<uni-easyinput v-model="form.deposit" :disabled="isView" placeholder="请输入开户支行" />
			</uni-forms-item>
			<uni-forms-item label="账户" required name="accountAccount">
				<uni-easyinput v-model="form.accountAccount" :disabled="isView" placeholder="请输入账户" />
			</uni-forms-item>
			<view class="form_sub_button" v-if=" type!=='view' ">
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
			</view>
			<view class="form_sub_button" v-else>

				<button :params="form" @click="handleUpdate(form)" type="primary" :loading="buttonLoading">修改</button>
				<!-- <button :params="form" @click="cancelProcessApply(form)" :loading="buttonLoading" :disabled="isView">撤销</button> -->
				<button :params="form" @click="handleDelete(form)" type="warn" :loading="buttonLoading">删除</button>
				<!-- 	<FormButton :params="form" :status="form.actBusinessStatus" @update="handleUpdate(form)"
				 @delete="handleDelete(form)">
			</FormButton> -->
			</view>
		</uni-forms>


		<!-- <uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col>
					<button @click="submitForm" type="primary" :disabled="isView" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->
	</view>
</template>

<script>
	import {
		addInformation,
		updateInformation,
		getInformation,
		delInformation
	} from "@/api/demo/information";
	import {
		getUserProfile
	} from "@/api/system/user";
	import {
		checkPhone,
		checkEmail
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
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type: '',
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					vendorName: {
						rules: [{
							required: true,
							errorMessage: "供应商名称不能为空",
						}]
					},
					contact: {
						rules: [{
							required: true,
							errorMessage: "联系人不能为空",
						}]
					},
					contactDetails: {
						rules: [{
							required: true,
							errorMessage: "联系电话不能为空",
							validateFunction: (rule, value, data, callback) => checkPhone(rule, value, data,
								callback)
						}]
					},
					mailbox: {
						rules: [{
							required: true,
							errorMessage: "邮箱不能为空",
							validateFunction: (rule, value, data, callback) => checkEmail(rule, value, data,
								callback)
						}]
					},
					accountName: {
						rules: [{
							required: true,
							errorMessage: "开户名不能为空"
						}]
					},
					deposit: {
						rules: [{
							required: true,
							errorMessage: "开户支行不能为空",
						}]
					},
					accountAccount: {
						rules: [{
							required: true,
							validator: (rule, value, callback) => checkAccount(rule, value, callback),
							errorMessage: "账户不能为空",
						}]
					}
				},
				// 单选数据源
				bs_travel_type: [],
				bs_urgency: [],
				// 按钮加载状态
				buttonLoading: false,

				// 上传文件
				imageValue: [],
				// 回退id
				backId: undefined,
			}
		},
		methods: {
			//获取数据
			getInfo(id) {
				console.log('45555555555', id)
				getInformation(id).then(response => {
					console.log('Informationedit>', response.data)
					this.form = response.data;
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
						if (this.form.id != null) {
							this.backId = this.form.id
							response = await updateInformation(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
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
							response = await addInformation(this.form).then(response => {
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
			// 修改事件
			async handleUpdate(form) {
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title: '修改供应商业务'
				})
				await this.getInfo(form.id)
				this.isView = false
			},
			cancelProcessApply(form) {
				let row = form.actBusinessStatus
				this.$modal.confirm('是否撤销申请').then(() => {
					this.loading = true;
					return processAip.cancelProcessApply(row.processInstanceId);
				}).then(async () => {
					// await fallbackUserDays(row.id)
					this.getInfo(form.id);
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
					title: '修改供应商业务'
				})
				this.getInfo(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增供应商业务'
				})
			} else if (type === 'view') {
				uni.setNavigationBarTitle({
					title: '查看供应商业务'
				})
				this.isView = true
				this.getInfo(option.id)
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

