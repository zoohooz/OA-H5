<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="字典类型" required name="dictType">
				<uni-easyinput v-model="form.dictType" placeholder="请输入字典类型" :disabled="true" />
			</uni-forms-item>
			<uni-forms-item label="数据标签" required name="dictLabel">
				<uni-easyinput v-model="form.dictLabel" placeholder="请输入数据标签"/>
			</uni-forms-item>
			<uni-forms-item label="数据键值" required name="dictValue">
				<uni-easyinput v-model="form.dictValue" placeholder="请输入数据键值"/>
			</uni-forms-item>
			<uni-forms-item label="样式属性" name="cssClass">
				<uni-easyinput v-model="form.cssClass" placeholder="请输入样式属性"/>
			</uni-forms-item>
			<uni-forms-item label="显示排序" required name="dictSort">
				<uni-number-box :min="0" v-model="form.dictSort"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="回显样式" name="listClass">
				<uni-data-select v-model="form.listClass" :localdata="listClassOptions">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="状态" name="status">
				<uni-data-checkbox v-model="form.status" :localdata="act_statusList" />
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput type="textarea" v-model="form.remark" placeholder="请输入内容" />
			</uni-forms-item>
			
			
			<!-- <uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col >
					<button @click="submitForm" type="primary" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row> -->
			
			<view class="form_sub_button" v-if="!isForm">
				<button v-if="type !== 'add'" @click="handleDelete(form)" type="warn">删除</button>
				<button @click="submitForm" type="primary" :loading="buttonLoading">提交</button>
			</view>

		</uni-forms>
	</view>
</template>

<script>
	import {
		getData,
		addData,
		updateData,
		delType
	} from "@/api/system/dict/data";
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
				// 表单校验
				rules: {
					dictLabel: {
						rules: [{
							required: true,
							errorMessage: "数据标签不能为空"
						}]
					},
					dictValue: {
						rules: [{
							required: true,
							errorMessage: "数据键值不能为空"
						}]
					},
					dictSort: {
						rules: [{
							required: true,
							errorMessage: "数据顺序不能为空"
						}]
					}
				},
				value: "default",
				// 数据标签回显样式
				listClassOptions: [{
						value: "default",
						text: "默认"
					},
					{
						value: "primary",
						text: "主要"
					},
					{
						value: "success",
						text: "成功"
					},
					{
						value: "info",
						text: "信息"
					},
					{
						value: "warning",
						text: "警告"
					},
					{
						value: "danger",
						text: "危险"
					}
				],
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
			change(e) {
				console.log('33333', e)
			},
			//获取数据
			getDatas(id) {
				console.log('45555555555', id)
				getData(id).then(response => {
					console.log('Typeedit>', response)
					this.form = response.data;
					this.tableData = this.form.paymentRecordsList
				});
			},
			cancle() {
				uni.navigateBack({
					delta: 1
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
						if (this.form.dictCode != null) {
							this.backId = this.form.dictCode
							response = await updateData(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.$tab.navigateBack(1)
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
						} else {
							await getUserProfile().then(res => {
								this.form.deptId = res.data.user.deptId
								this.form.userId = res.data.user.userId
							})
							response = await addData(this.form).then(response => {
								this.backId = response.id
								this.$modal.msgSuccess("新增成功");
								this.$tab.navigateBack(1)
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
						}
					}
				});
			},
			handleDelete({dictCode}) {
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + dictCode + '"的数据项？').then(function() {
					that.loading = true;
					return delType(dictCode);
				}).then(() => {
					that.$modal.msgSuccess("删除成功")
					that.$tab.navigateBack(1)
				}).catch(() => {
					that.$modal.msgError("删除失败")
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
					title: '修改字典数据'
				})
				this.getDatas(option.id)
			} else if (type === 'add') {
				console.log(option)
				uni.setNavigationBarTitle({
					title: '添加字典数据'
				})
				this.form.dictType = option.data
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
