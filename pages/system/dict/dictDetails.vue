<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="字典名称" required name="dictName">
				<uni-easyinput v-model="form.dictName" placeholder="请输入字典名称" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="字典类型" required name="dictType">
				<uni-easyinput v-model="form.dictType" placeholder="请输入字典类型" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="状态" name="status" :disabled="true">
				<uni-data-checkbox v-model="form.status" :localdata="act_statusList" />
			</uni-forms-item>
			<uni-forms-item label="备注" name="remark">
				<uni-easyinput type="textarea" v-model="form.remark" :disabled="isView" placeholder="请输入内容" />
			</uni-forms-item>
			
			<view v-show="type === 'edit'" style="padding-bottom:80px;">
				<dataView :id="form.dictId"></dataView>
			</view>
			 
			<view class="form_sub_button" v-if="!isForm">
				<!-- <uni-col> -->
					<button v-if="type === 'edit'" @click="handleDelete" type="warn">删除</button>
					<button @click="submitForm" type="primary" :loading="buttonLoading">提交</button>
				<!-- </uni-col> -->
			</view>

		</uni-forms>
	</view>
</template>

<script>
	import dataView from './data'
	import {
		addType,
		updateType,
		getType,
			listType,
			delType,
			refreshCache
	} from "@/api/system/dict/type";
	
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
		components:{
			dataView
		},
		data() {
			return {
				loading: true,
				// 是否只读
				isView: false,
				// 操作类型
				type: '',
				// 表单参数
				form: {
					dictId: 0,
				},
				// 表单校验
				rules: {
					dictName: {
						rules: [{
							required: true,
							errorMessage: "字典名称不能为空"
						}]
					},
					dictType: {
						rules: [{
							required: true,
							errorMessage: "字典类型不能为空"
						}]
					}
				},
				act_statusList:[
					{
						text: '正常',
						value: "0",
						disable: false,
					
					}, {
						text: '停用',
						value: "1",
						disable: false,
					}
				],
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
			getTypes(id) {
				console.log('45555555555', id)
				getType(id).then(response => {
					console.log('Typeedit>', response)
					this.form = response.data;
					this.tableData = this.form.paymentRecordsList
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
						if (this.form.dictId != null) {
							this.backId = this.form.dictId
							response = await updateType(this.form).then(response => {
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
							response = await addType(this.form).then(response => {
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
			handleDelete({dictId}) {
				if (dictId == "") {
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + dictId + '"的数据项？').then(function() {
					that.loading = true;
					return delType(dictId);
				}).then(() => {
					that.$modal.msgSuccess("删除成功")
					that.$tab.navigateBack(1)
				}).catch(() => {
					that.$modal.msgError("删除失败")
				});
			},
		},
		mounted() {},
		created() {
			
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
					title: '修改字典类型'
				})
				this.isView = false
				this.form.dictId = option.id
				this.getTypes(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '新增字典类型'
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

<style>

</style>
