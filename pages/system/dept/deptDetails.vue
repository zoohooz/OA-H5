<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>
			<uni-forms-item label="上级部门" required name="parentId">
				<DeptSelect @confirm="confirm" :label="deptLabel"></DeptSelect>
			</uni-forms-item>
			<uni-forms-item label="部门名称" required name="deptName">
				<uni-easyinput v-model="form.deptName" placeholder="请输入部门名称" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="显示排序" required name="orderNum">
				<uni-number-box v-model="form.orderNum" :min="0"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="负责人" name="leader" :disabled="true">
				<uni-easyinput v-model="form.leader" placeholder="请输入负责人" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="联系电话" name="phone">
				<uni-easyinput v-model="form.phone" :disabled="isView" placeholder="请输入联系电话" />
			</uni-forms-item>
			<uni-forms-item label="邮箱" name="email">
				<uni-easyinput v-model="form.email" :disabled="isView" placeholder="请输入邮箱" />
			</uni-forms-item>
			<uni-forms-item label="部门状态" name="phone">
				<uni-data-checkbox v-model="form.status" :localdata="act_statusList" />
			</uni-forms-item>
			<uni-row class="demo-uni-row" v-if="!isForm">
				<uni-col :span="12">
					<button @click="cancle">取消</button>
				</uni-col>
				<uni-col :span="12">
					<button @click="submitForm" type="primary" :loading="buttonLoading">确定</button>
				</uni-col>
			</uni-row>

		</uni-forms>
	</view>
</template>

<script>
	import {
		addDept,
		updateDept,
		getDept,
		listDeptExcludeChild
	} from "@/api/system/dept";
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
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
			DeptSelect
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
				informationList: [],
				deptLabel:''
			}
		},
		methods: {
			//获取数据
			getDepts(id) {
				console.log('45555555555', id)
				getDept(id).then(response => {
					console.log('traveledit>', response)
					this.form = response.data;
					// 部门
					this.form.parentId = response.data.parentId
					this.deptLabel = response.data.deptName
				});
			},
			confirm(e) {
				this.form.deptId = e[0].id
				this.deptLabel = e[0].label
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
						if (this.form.deptId !=undefined ) {
							response = await updateDept(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								return response
							}).finally(() => {
								this.buttonLoading = false;
							});
						} else {
							response = await addDept(this.form).then(response => {
								this.$modal.msgSuccess("新增成功");
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
					title: '修改部门'
				})
				this.isView = false
				this.getDepts(option.id)
			} else if (type === 'add') {
				uni.setNavigationBarTitle({
					title: '添加部门'
				})
				this.deptLabel =option.data
				this.form.deptId = option.id
				this.isView = false
			} else if (type === 'addIn') {
				uni.setNavigationBarTitle({
					title: '添加部门'
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
