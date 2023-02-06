<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt" style="padding: 10px 30px">
			<uni-segmented-control :current="current" :values="['新申请','已提交']" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view v-show="current === 0">
			<resignationApprovalDetails :selectUser="selectUser" ></resignationApprovalDetails>
		</view>

		<view v-show="current === 1">
			<!-- 查询条件 -->
			<uni-collapse accordion>
				<uni-collapse-item title="搜索" :open="false">
					<!-- 表头插槽 -->
					<template v-slot:title>
						<uni-list>
							<uni-list-item title="搜索" :show-extra-icon="true"
								:extra-icon="{	color: '#0081ff',	size: '20',	type: 'search'}" />
						</uni-list>
					</template>

					<view class="example">

						<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
							<uni-forms-item label="标题">
								<uni-easyinput type="text" v-model="queryParams.title" placeholder="请输入标题" />
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
			<uni-list :border="true">
				<uni-list-item :border="true" uni_border_color="#a6a6a6" clickable v-for="(item,index) in leaveList"
					:key="index" :rightText="item.createTime"
					:to="`/pages/business/resignationApproval/resignationApprovalDetails?type=view&id=${item.id}`">

					<template v-slot:body>
						<view class="slot-body">
							<view class="list_title ">
								<uni-title type="h2" title="离职申请"></uni-title>
							</view>
							<view class="list_body">
								<view class="list_body_content">
										<view style="margin-right: 5px;">
											申请人：{{item.applicant}}
										</view>
										<view class="" v-if="item.handoverPersonnel">
											交接人员: {{item.handoverPersonnel}}
										</view>
								</view>
								<view class="list_body_content" style="color: #999999;">申请时间: {{item.createTime}}</view>
							</view>
						</view>
					</template>

					<template v-slot:footer>
						<view class="list_footer">
								<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status"></DictTag>
						</view>
					</template>

				</uni-list-item>
			</uni-list>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
		<!-- 查询条件
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="true">

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="标题">
							<uni-easyinput type="text" v-model="queryParams.title" placeholder="请输入标题" />
						</uni-forms-item>

						<uni-row class="search_button" :gutter="12">
							<uni-col :span="12">
								<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
							</uni-col>
							<uni-col :span="12">
								<button @click="resetQuery" form-type="reset">重置</button>
							</uni-col>
						</uni-row>

					</uni-forms>

				</view>

			</uni-collapse-item>
		</uni-collapse>
		<!-- 操作按钮 
		<uni-row class="demo-uni-row example" :gutter="10">
			<uni-col :span="2.5">
				<button @click="handleAdd" class="cu-btn sm block line-blue">
					<text class="cuIcon-add"></text> 新增
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="handleDelete" class="cu-btn sm block line-red">
					<text class="cuIcon-delete"></text> 删除
				</button>
			</uni-col>
		</uni-row>
		<!-- 表格数据 
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">标题</uni-th>
					<uni-th align="center">紧急程度</uni-th>
					<uni-th align="center">申请人</uni-th>
					<uni-th align="center">交接人员</uni-th>
					<uni-th align="center">未完成事宜</uni-th>
					<uni-th align="center">离职原因</uni-th>
					<uni-th align="center">费用报销</uni-th>
					<uni-th align="center">流程状态</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.title }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="bs_urgency" :value="item.urgency" type="primary"></DictTag>
						</uni-td>
					<uni-td align="center">
						{{item.applicant}}
					</uni-td>
					<uni-td align="center">{{ item.handoverPersonnel }}</uni-td>
					<uni-td align="center">{{ item.unfinishedBusiness }}</uni-td>
					<uni-td align="center">{{ item.dimissionCause }}</uni-td>
					<uni-td align="center">{{ item.noReimbursement=='0'?'已完成':'未完成' }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<TabelButton :params="item" :status="item.actBusinessStatus.status"
								@update="handleUpdate(item)" @cancel="cancelProcessApply(item)" @view="handleView(item)"
								@delete="handleDelete(item)"></TabelButton>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
 -->

	</view>
</template>

<script>
	import resignationApprovalDetails from './resignationApprovalDetails'
	import {
		listDimission,
		// delDimission
	} from "@/api/demo/demissionApplication";
	// import processAip from "@/api/workflow/processInst";
	export default {
		components: {
			resignationApprovalDetails
		},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 30,
					username: undefined,
					duration: undefined,
					leaveType: undefined,
					title: undefined
				},
				total: 0,
				bs_urgency: [],
				act_statusList: [],
				ids: [],
				activeColor: '#007aff',
				styleType: 'button',
				selectUser:'',
				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				current: 0
			}
		},
		methods: {
			confirmUser(userList, nodeId) {
				console.log('选择人员回调-->', userList, nodeId)
				let nickName = userList.map((item) => {
					return item.nickName;
				});
				this.selectUser = nickName[0]
				console.log('this.selectUser',this.selectUser)
			},
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
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 30,
					username: undefined,
					duration: undefined,
					leaveType: undefined,
					title: undefined
				}
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询离职申请列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listDimission(this.queryParams).then(response => {
					console.log('离职==>', response)
					this.leaveList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			// // 分页触发
			// change(e) {
			// 	this.$refs.table.clearSelection()
			// 	this.ids.length = 0
			// 	this.queryParams.pageNum = e.current
			// 	this.getList()
			// },
			// // 多选
			// selectionChange(e) {
			// 	this.ids = e.detail.index.map(item => {
			// 		return this.leaveList[item].id
			// 	})
			// 	console.log('ids==>', this.ids)
			// },
			// /** 新增按钮操作 */
			// handleAdd() {
			// 	uni.navigateTo({
			// 		url: `/pages/business/resignationApproval/resignationApprovalDetails?type=add`
			// 	});
			// },
			// // 修改事件
			// handleUpdate(row) {
			// 	console.log('handleUpdate====', row)
			// 	const id = row.id || this.ids[0];
			// 	console.log('edit', id)
			// 	if (!id) {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url: `pages/business/resignationApproval/resignationApprovalDetails?type=edit&id=${id}`
			// 	});
			// },
			// //撤回
			// cancelProcessApply(row) {
			// 	this.$modal.confirm('是否撤销申请').then(() => {
			// 		this.loading = true;
			// 		return processAip.cancelProcessApply(row.processInstanceId);
			// 	}).then(async () => {
			// 		await fallbackUserDays(row.id)
			// 		this.getList();
			// 		this.$modal.msgSuccess("撤回成功");
			// 	}).finally(() => {
			// 		this.loading = false;
			// 	});
			// },
			// // 查看
			// handleView(row) {
			// 	console.log('handleView====', row)
			// 	let formList = {
			// 		'com.ycyy.demo.domain.BsLeave': 'leaveForm',
			// 		'com.ycyy.demo.domain.Reimbursement': 'burseForm',
			// 		'com.ycyy.demo.domain.BsTravel': 'travelForm',
			// 		'com.ycyy.demo.domain.RegularWorker': 'regularWorkerForm',
			// 		'com.ycyy.demo.domain.SysPaymentSchedule': 'paymentForm',
			// 		'com.ycyy.demo.domain.DimissionApplication': 'resignationApprovalForm',
			// 		'com.ycyy.demo.domain.OvertimeApplicatlon': 'overtimeForm',
			// 	}
			// 	let item = {
			// 		businessKey: row.actBusinessStatus.businessKey,
			// 		processInstanceId: row.processInstanceId,
			// 		taskId: row.id,
			// 		parentTaskId: row.parentTaskId,
			// 		currProcessForm: formList[row.actBusinessStatus.classFullName],
			// 	}
			// 	let data =  encodeURIComponent(JSON.stringify(item))
			// 	console.log('000000000',item)
			// 	this.$tab.navigateTo(
			// 		`/pages/components/approvalForm?data=${data}`
			// 	)
			// },
			// // 删除
			// handleDelete(row) {
			// 	const id = row.id || this.ids;
			// 	// console.log('handleDelete====',id)
			// 	if (id == "") {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	let that = this
			// 	that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
			// 		that.loading = true;
			// 		return delDimission(id);
			// 	}).then(() => {
			// 		that.loading = false;
			// 		that.$modal.msgSuccess("删除成功");
			// 		that.getList();
			// 	}).catch(() => {
			// 		that.loading = false;
			// 	});
			// },
		},
		created() {
			this.ids = []
			this.$getDicts("bs_urgency").then(res => {
				this.bs_urgency = res.data

			});
			this.$getDicts("act_status").then(res => {
				this.act_statusList = res.data
			});

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

<style lang="scss" scoped>
	.uni-list-item {
		.slot-body {
			flex: 1;

			.dict_tag {
				padding: 0px 8px;
			}
		}

		.list_title {
			.uni-title__box {
				flex: unset;
			}

			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			align-items: center;
		}

		.list_body {
			display: flex;
			flex-direction: column;

			.list_body_content {
				display: flex;
				padding-top: 8px;
			}
		}

		.list_footer {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-top: 10px;

			uni-text:nth-of-type(1) {
				color: #b1b1b1;
			}

			uni-text:nth-of-type(2) {
				font-size: 14px;
			}
		}

		::v-deep .uni-list-item__extra {
			align-items: flex-start;
		}
	}
</style>
