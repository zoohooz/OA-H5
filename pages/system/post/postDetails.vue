<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="岗位名称" required name="postName">
				<uni-easyinput v-model="form.postName" placeholder="请输入岗位名称" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="岗位编码" required name="postCode">
				<uni-easyinput v-model="form.postCode" placeholder="请输入岗位编码" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="岗位顺序" required name="postSort" :disabled="true">
				<uni-number-box v-model="form.postSort" :min="0"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="岗位状态" name="status" :disabled="true">
				<uni-data-checkbox v-model="form.status" :localdata="act_statusList" />
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput type="textarea" v-model="form.remark" :disabled="isView" placeholder="请输入备注" />
			</uni-forms-item>
			<uni-row class="demo-uni-row" v-if=" type!=='edit'">
				<uni-col>
					<button @click="submitForm(form)" type="primary" :loading="buttonLoading">提交</button>
				</uni-col>
			</uni-row>
			<view class="form_sub_button" v-else>
				<button @click="submitForm(form)" type="primary" :loading="buttonLoading">修改</button>
				<button @click="handleDelete(form)" type="warn" :loading="buttonLoading">删除</button>
			</view>

		</uni-forms>
	</view>
</template>

<script>
	import {
		addPost,
		updatePost,
		getPost,
		delPost
	} from "@/api/system/post.js";
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
				type: '',
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					postName: {
						rules: [{
							required: true,
							errorMessage: "岗位名称不能为空"
						}]
					},
					postCode: {
						rules: [{
							required: true,
							errorMessage: "岗位编码不能为空"
						}]
					},
					postSort: {
						rules: [{
							required: true,
							errorMessage: "岗位顺序不能为空"
						}]
					},
					status: {
						rules: [{
							required: true,
							errorMessage: "岗位状态不能为空"
						}]
					}
				},
				act_statusList: [{
					text: '正常',
					value: "0",
					disable: false,

				}, {
					text: '停用',
					value: "1",
					disable: false,
				}],
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
				tableData: [],
				informationList: []
			}
		},
		methods: {
			//获取数据
			getPosts(id) {
				console.log('45555555555', id)
				getPost(id).then(response => {
					console.log('traveledit>', response)
					this.form = response.data;
				});
			},
			// 删除
			handleDelete(row) {
				const id = row.postId
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delPost(id);
				}).then(() => {
					that.loading = false;
					setTimeout(() => {
						that.$tab.navigateBack(1)
					}, 1000)
					that.$modal.msgSuccess("删除成功")
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
						if (this.form.postId != null) {
							this.backId = this.form.postId
							response = await updatePost(this.form).then(response => {
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
							response = await addPost(this.form).then(response => {
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
		created() {},
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
					title: '修改岗位'
				})
				this.isView = false
				this.getPosts(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增岗位'
				})
				this.isView = false
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
		position: relative;
	}
</style>
