<template>
	<view class="form_list">
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['待处理','已处理']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			
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
						<uni-forms :model="queryParams" ref="queryForm" label-width='100px' label-align='right'>
			
							<uni-forms-item label="流程名称" name="name">
								<uni-easyinput type="text" v-model="queryParams.name" placeholder="请输入流程名称" />
							</uni-forms-item>
			
							<!-- 搜索按钮 -->
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
			  title="startUserNickName+的+「+processDefinitionName+」+申请"
				:dictTag="{
					dict: [{dictLabel:'激活',dictValue:'激活'},{dictLabel:'挂起',dictValue:'text'}],
					value: 'processStatus'
				}"
				:list="dataList"
				:content="contentList"
				:to="false"
				@click="(item) => clickTaskPop(item)"
			></FormListContent>
			
			<!-- 表格数据 -->
			<view class="uni-container">
				<!-- <uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center">任务名称</uni-th>
						<uni-th align="center">流程定义名称</uni-th>
						<uni-th align="center">版本号</uni-th>
						<uni-th align="center">流程发起人</uni-th>
						<uni-th align="center">当前流程办理人</uni-th>
						<uni-th align="center">流程状态</uni-th>
						<uni-th align="center">流程关联业务ID</uni-th>
						<uni-th align="center">创建时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in dataList" :key="index">
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{ item.processDefinitionName }}</uni-td>
						<uni-td align="center">{{ item.processDefinitionVersion }}</uni-td>
						<uni-td align="center">{{ item.startUserNickName }}</uni-td>
						<uni-td align="center">{{ item.assignee }}</uni-td>
						<uni-td align="center">
							<uni-tag :inverted="true" text="激活" type="success" v-if="item.processStatus=='激活'" />
							<uni-tag :inverted="true" text="挂起" type="error" v-else />
						</uni-td>
						<uni-td align="center">{{ item.businessKey }}</uni-td>
						<uni-td align="center">{{ item.createTime }}</uni-td>
						<uni-td align="center">
							<view class="table_button">
								<button class="uni-button" size="mini" type="primary" plain="true"
									v-if="item.isClaim===false" @click="clickClaim(item)">签收</button>
								<button class="uni-button" size="mini" type="primary" plain="true"
									v-if="item.isClaim===true" @click="returnTask(item)">归还</button>
								<button class="uni-button" size="mini" type="primary" plain="true"
									@click="clickTaskPop(item)">办理</button>
								<button class="uni-button" size="mini" type="primary" plain="true"
									@click="clickHistPop(item)">审批记录</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table> -->
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
						:total="total" @change="change" />
				</view>
			</view>
			
		</view>
		
		<view v-if="current === 1">
			<personalFinish></personalFinish>
		</view>
		
	</view>
</template>

<script>
	import api from '@/api/workflow/task'
	import personalFinish from './personalFinish'
	export default {
		components: {
			personalFinish
		},
		data() {
			return {
				// 分段器
				current: 0,
				colorIndex: 0,
				// 遮罩层
				loading: true,
				// 总条数
				total: 0,
				// 表格数据
				dataList: [],
				contentList:[
					{
						label: '流程定义名称',
						prop: 'processDefinitionName',
					},
					{
						label: '任务名称',
						prop: 'name',
					},
					{
						label: '当前流程办理人',
						prop: 'assignee',
					},
				],
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					name: ''
				},

				ids: [],
				// 非单个禁用
				single: true,
				// 非多个禁用
				multiple: true,

				// 任务id
				taskId: undefined,
				taskVariables: undefined,
				processInstanceId: undefined,
				parentTaskId: undefined,
				businessKey: undefined, // 业务唯一标识
				visible: false,
				currProcessForm: '' ,//表单组件名称
				
				// 页面跳转数据
				toData: undefined,
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			// 分页触发
			change(e) {
				this.$refs?.table?.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			// 多选
			selectionChange(e) {
				// this.ids = e.detail.index.map(item => {
				// 	return this.leaveList[item].id
				// })
				// this.single = e.detail.index.length !== 1
				// this.multiple = !e.detail.index.length
				// console.log('ids==>', this.ids)
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.daterangeCreateTime = [];
				this.resetForm("queryForm");
				this.handleQuery();
			},
			//分页
			getList() {
				this.loading = true;
				api.getTaskWaitByPage(this.queryParams).then(response => {
					this.dataList = response.rows;
					this.total = response.total;
					this.loading = false;
				})
			},
			//刷新
			refresh() {
				this.getList()
			},

			//审批记录
			clickHistPop(row) {
				this.processInstanceId = row.processInstanceId
				let item = {
					processInstanceId: row.processInstanceId,
				}
				let data = encodeURIComponent(JSON.stringify(item))
				this.$tab.navigateTo(
					`/components/Process/History?data=${data}`
				)
			},
			// 办理任务弹出层
			clickTaskPop(row) {
				console.log('666',row)
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
					businessKey: row.businessKey,
					processInstanceId: row.processInstanceId,
					taskId: row.id,
					parentTaskId: row.parentTaskId,
					currProcessForm: formList[row.actBusinessStatus.classFullName],
				}
				let data = encodeURIComponent(JSON.stringify(item))
				console.log('21211',data)
				this.$tab.navigateTo(
					`/pages/components/approvalForm?data=${data}`
				)
			}
		},
		mounted() {},
		created() {

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
			this.getList();
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
