<template>
	<view class="example">
		<uni-forms :modelValue="form" ref="form" :rules="rules" label-width='89px' label-align='right'>

			<uni-forms-item label="供应商名称" required name="supplierName">
				<uni-easyinput v-model="form.supplierName" placeholder="请输入费用金额" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="费用金额" required name="costAmount">
				<uni-easyinput v-model="form.costAmount" placeholder="请输入费用金额" :disabled="isView" />
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
			<uni-forms-item label="备注" name="remarks">
				<uni-easyinput type="textarea" v-model="form.remarks" :disabled="isView" placeholder="请输入备注" />
			</uni-forms-item>
		</uni-forms>
		<uni-section title="报销明细" type="line" style="margin-top:13px;">
			<uni-table ref="tableData" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">发票号码</uni-th>
					<uni-th align="center">发票面值</uni-th>
					<uni-th align="center">已付款</uni-th>
					<uni-th align="center">未付款</uni-th>
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
				</uni-tr>
			</uni-table>
		</uni-section>
		<uni-row class="demo-uni-row example formButtom" :gutter="10">
					<uni-col :span="2.5">
						<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-grey">
							暂存
						</button>
					</uni-col>
					<uni-col :span="2.5">
						<button :loading="buttonLoading" @click="submitForm" class="cu-btn sm block bg-blue">
							提交
						</button>
					</uni-col>
					<uni-col :span="2.5">
						<button @click="cancel" class="cu-btn sm block line-whilte">
							取 消
						</button>
					</uni-col>
				</uni-row>
	</view>
</template>

<script>
	import {
		getPayment
	} from "@/api/demo/payment";
	import {
		checkPhone,
		fileUrl
	} from "@/utils/burse"
	import processAip from "@/api/workflow/processInst";
	export default {
		props: {
			businessKey: String, // 业务唯一标识
			parentTaskId: String, // 父级任务id
			taskId: String // 任务id
		},
		data() {
			return {
				loading: true,
				// 是否只读
				isView: true,
				// 操作类型
				type: '',
				// 表单参数
				form: {},
				// 单选数据源
				sys_done: [{
					text: '已完成',
					value: 1,
					disable: false,
				}, {
					text: '未完成',
					value: 0,
					disable: false,
				}],
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
				// 按钮加载状态
				buttonLoading: false,
				// 回退id
				backId: undefined,
				tableData: [],
				informationList: [],
				type:''
			}
		},
		created() {
			this.form = JSON.parse(JSON.stringify(this.form));
			this.tableData = this.form.paymentRecordsList
			console.log(this.tableData)
			if(this.tableData!==undefined){
				this.loading= true
			} else {
				this.loading = false
			}
			let queryparams = {
				pageNum: 1,
				page: 10
			}
		},
		watch: {
			businessKey: {
				immediate: true, // 很重要！！！
				handler(newVal) {
					if (newVal) {
						this.getById()
					}
				}
			}
		},
		methods: {
			async getById() {
				console.log('this.businessKey',this.businessKey)
				const {
					data
				} = await getPayment(this.businessKey)
				this.form = data;
				this.tableData = data.paymentRecordsList;
			},
			/** 提交按钮 */
			submitForm() {
				getPayment(this.businessKey).then(response => {
					this.taskVariables = {
						entity: response.data,
						userId: 1
					};
					this.sendMessage = {
						title: '付款追踪申请',
						messageContent: '单据【' + this.businessKey + "】申请"
					}
					this.submitFormApply(response.data)
				});
			},
			//提交流程
			submitFormApply(entity) {
				let item = {
					taskId: this.taskId,
					taskVariables: this.taskVariables,
					sendMessage: this.sendMessage,
					navigateBack: 2
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log(data, '-----data')
				this.$tab.navigateTo(
					`/components/Process/Verify?data=${data}`
				)
			},
		},
		mounted() {},
		created() {
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {

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
