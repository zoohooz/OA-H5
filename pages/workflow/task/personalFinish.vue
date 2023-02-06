<template>
	<view>
		<!-- 查询条件 -->
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="false">
				<!-- 表头插槽 -->
				<template v-slot:title>
					<uni-list>
						<uni-list-item title="搜索" :show-extra-icon="true"
							:extra-icon="{	color: '#0081ff',	size: '20',	type: 'search'}" />
					</uni-list>
				</template>

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="流程名称">
							<uni-easyinput type="text" v-model="queryParams.name" placeholder="请输入流程名称" />
						</uni-forms-item>
						<uni-row class="search_button" :gutter="12">
							<uni-col :span="12">
								<button @click="resetQuery" form-type="reset">重置</button>
							</uni-col>
							<uni-col :span="12">
								<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
							</uni-col>
						</uni-row>

					</uni-forms>

				</view>

			</uni-collapse-item>
		</uni-collapse>
		
		<!-- 列表数据 -->
		<FormListContent
		  title="「+processDefinitionName+」+申请"
			:dictTag="{
				dict: [{dictLabel:'激活',dictValue:'激活'},{dictLabel:'挂起',dictValue:'text'}],
				value: 'processStatus'
			}"
			:list="List"
			:content="contentList"
			:to="false"
			@click="(item) => handleView(item)"
		></FormListContent>
		
		<!-- 表格数据 -->
		<view class="uni-container">
			<!-- <uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">任务名称</uni-th>
					<uni-th align="center">流程定义名称</uni-th>
					<uni-th align="center">流程定义Key</uni-th>
					<uni-th align="center">版本号</uni-th>
					<uni-th align="center">流程办理人</uni-th>
					<uni-th align="center">启动时间</uni-th>
					<uni-th align="center">结束时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in List" :key="index">
					<uni-td align="center">{{ item.name }}</uni-td>
					<uni-td align="center">{{ item.processDefinitionName }}</uni-td>
					<uni-td align="center">
						{{item.processDefinitionKey}}
					</uni-td>
					<uni-td align="center">V{{ item.version }}.0</uni-td>
					<uni-td align="center">{{ item.assignee }}</uni-td>
					<uni-td align="center">{{ item.startTime }}</uni-td>
					<uni-td align="center">{{ item.endTime }}</uni-td>
					<uni-td align="center">
						<button class="uni-button" size="mini" @click="handleView(item)">查看</button>
					</uni-td>
				</uni-tr>
			</uni-table> -->
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>


	</view>
</template>

<script>
	import api from '@/api/workflow/task'
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	import processAip from "@/api/workflow/processInst";
	export default {
		components: {},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					beginTime: undefined,
					endTime: undefined,
					supplierName: undefined,
					invoiceNumber: undefined
				},
				total: 0,
				act_statusList: [],
				ids: [],

				// 遮罩层
				loading: true,
				// 表格数据
				List: [],
				contentList:[
					{
						label: '流程办理人',
						prop: 'assignee',
					},
					{
						label: '启动时间',
						prop: 'startTime',
					},
					{
						label: '结束时间',
						prop: 'endTime',
					},
				],
				dateRange:[]
			}
		},
		methods: {
			// 分页触发
			change(e) {
				this.$refs?.table?.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.List[item].id
				})
				console.log('ids==>', this.ids)
			},
			/** 搜索按钮操作 */
			handleQuery() {
				if (this.dateRange?.length > 0) {
					({
						0: this.queryParams.beginTime,
						1: this.queryParams.endTime
					} = this.dateRange)
				} else {
					this.queryParams.beginTime = undefined
					this.queryParams.endTime = undefined
				}
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					beginTime: undefined,
					endTime: undefined,
					supplierName: undefined,
					invoiceNumber: undefined
				}
				this.dateRange = []
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询付款追踪列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				api.getTaskFinishByPage(this.queryParams).then(response => {
					console.log('已办=>', response)
					this.List = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 新增按钮操作 */
			handleView(row) {
				console.log('99999999999999',row)
				let formList = {
					'com.ycyy.demo.domain.BsLeave': 'leaveForm',
					'com.ycyy.demo.domain.Reimbursement': 'burseForm',
					'com.ycyy.demo.domain.BsTravel': 'travelForm',
					'com.ycyy.demo.domain.RegularWorker': 'regularWorkerForm',
					'com.ycyy.demo.domain.SysPaymentSchedule': 'paymentForm',
					'com.ycyy.demo.domain.DimissionApplication': 'resignationApprovalForm',
					'com.ycyy.demo.domain.OvertimeApplicatlon': 'overtimeForm',
					'com.ycyy.demo.domain.Loan': 'loanForm',
					'com.ycyy.demo.domain.RoseMoneyApplication':'salaryForm'
				}
				let item = {
					businessKey: row.id,
					processInstanceId: row.processInstanceId,
					taskId: row.id,
					parentTaskId: row.parentTaskId,
					currProcessForm: formList[row.processDefinitionKey],
					flag:true
				}
				let data =  encodeURIComponent(JSON.stringify(item))
				console.log('000000000',item)
				this.$tab.navigateTo(
					`/pages/components/approvalForm?data=${data}`
				)
			},
		},
		created() {
			this.getList()
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {
			//页面初次渲染完成
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
			console.log('页面显示')
			this.getList()
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
