<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="公告标题" required name="noticeTitle">
				<uni-easyinput v-model="form.noticeTitle" placeholder="请输入公告标题" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="公告类型" required name="noticeType">
				<uni-data-select v-model="form.noticeType" :localdata="act_statusLists" placeholder="公告类型" :disabled="isView">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="状态" name="status">
				<uni-data-checkbox v-model="form.status" :localdata="act_statusList" />
			</uni-forms-item>
			<uni-forms-item label="内容" name="noticeContent">
				<uni-easyinput type="textarea" v-model="form.noticeContent" :disabled="isView" placeholder="请输入内容" />
			</uni-forms-item>
			<view v-show="isView == false">
			<uni-row class="demo-uni-row" v-if=" type!=='edit' ">
				<uni-col>
					<button @click="submitForm(form)" type="primary" :loading="buttonLoading">提交</button>
				</uni-col>
			</uni-row>
			<view class="form_sub_button" v-else>
				<button @click="submitForm(form)" type="primary" :loading="buttonLoading">修改</button>
				<button @click="handleDelete(form)" type="warn" :loading="buttonLoading">删除</button>
			</view>
			</view>
			
		</uni-forms>
	</view>
</template>

<script>
	import {
		getNotice,
		addNotice,
		updateNotice,
		delNotice
	} from "@/api/system/notice";
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
					noticeTitle: {
						rules: [{
							required: true,
							errorMessage: "公告标题不能为空"
						}]
					},
					noticeType: {
						rules: [{
							required: true,
							errorMessage: "公告类型不能为空"
						}]
					}
				},
				act_statusLists: [{
					text: '通知	',
					value: "1",
					disable: false,
				
				}, {
					text: '公告',
					value: "2",
					disable: false,
				}],
				act_statusList: [{
					text: '正常	',
					value: "0",
					disable: false,
				
				}, {
					text: '关闭',
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
			getNotices(id) {
				console.log('45555555555', id)
				getNotice(id).then(response => {
					console.log('Typeedit>', response)
					this.form = response.data;
				});
			},
			// 删除
			handleDelete(row) {
				const id = row.noticeId
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delNotice(id);
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
						if (this.form.noticeId != null) {
							this.backId = this.form.noticeId
							response = await updateNotice(this.form).then(response => {
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
							response = await addNotice(this.form).then(response => {
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
					title: '修改公告'
				})
				this.isView = false
				this.getNotices(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增公告'
				})
				this.isView = false
			} else if(type === 'news'){
				this.isView = true
				this.getNotices(option.id)
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
