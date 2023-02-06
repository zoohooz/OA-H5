<template>
	<view>
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-show="current === 0">
			<travelDetails ref="travelDetailRef"></travelDetails>
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
					:to="`/pages/business/travel/travelDetails?type=view&id=${item.id}`">
					
					<template v-slot:body>
						<view class="slot-body">
							<view class="list_title ">
								<uni-title type="h3" :title="item.title"></uni-title>
								<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status"></DictTag>
							</view>
							<view class="list_body">
								<view class="list_body_content">紧急程度:{{item.status==='1'?'正常':item.status==='2'?'优先':'紧急'}}
								</view>
								<view class="list_body_content">开始时间: {{item.startDate}}</view>
								<view class="list_body_content">结束时间: {{item.endDate}}</view>
							</view>
						</view>
					</template>
					
					<template v-slot:footer>
						<view class="list_footer">
							<text>{{item.createTime}}</text>
							<text>{{item.username}}</text>
						</view>
					</template>
					
				</uni-list-item>
			</uni-list>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
	<!-- 	查询条件
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
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">申请人</uni-th>
					<uni-th align="center">标题</uni-th>
					<uni-th align="center">紧急程度</uni-th>
					<uni-th align="center">外出开始时间</uni-th>
					<uni-th align="center">外出结束时间</uni-th>
					<uni-th align="center">状态</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.username }}</uni-td>
					<uni-td align="center">{{ item.title }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="bs_urgency" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.startDate }}</uni-td>
					<uni-td align="center">{{ item.endDate }}</uni-td>
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
			</view> -->
		</view>


	</view>
</template>

<script>
	import travelDetails from './travelDetails'
	import {
		listTravel,
		// delTravel
	} from "@/api/demo/travel";
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	import processAip from "@/api/workflow/processInst";
	export default {
		components: {travelDetails},
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

				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				current:0
			}
		},
		methods: {
			// 回退事件
			verifyCancel(){
				this.$refs.travelDetailRef.verifyCancel()
			},	
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.getList();
			},
			// 分页触发
			change(e) {
				this.$refs?.table?.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 100,
					username: undefined,
					duration: undefined,
					leaveType: undefined,
					title: undefined
				}
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询出差业务列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listTravel(this.queryParams).then(response => {
					console.log('出差==>', response)
					this.leaveList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			//确定选择人员
			confirmUser(userList, nodeId) {
				console.log('选择人员回调-->121212', userList, nodeId)
				let assignee = userList.map((item) => {
					return item.userId;
				});
				let nickName = userList.map((item) => {
					return item.nickName;
				});
				let arrAssignee = assignee.join(",");
				let arrNickName = nickName.join(",");
				this.form.handoverPersonnel = userList[0].nickName;
				console.log('交接人员id', this.form.userId);
				console.log('this.nickName[nodeId]', this.nickName)
				this.$forceUpdate();
			},
			// /** 新增按钮操作 */
			// handleAdd() {
			// 	uni.navigateTo({
			// 		url: `/pages/business/travel/travelDetails?type=add`
			// 	});
			// },
			// // 修改事件
			// handleUpdate(row) {
			// 	console.log('handleUpdate====', row)
			// 	const id = row.id || this.ids[0];
			// 	console.log('edit-->', id)
			// 	if (!id) {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url: `/pages/business/travel/travelDetails?type=edit&id=${id}`
			// 	});
			// },
			// //撤回
			// cancelProcessApply(row) {
			// 	this.$modal.confirm('是否撤销申请').then(() => {
			// 		this.loading = true;
			// 		return processAip.cancelProcessApply(row.processInstanceId);
			// 	}).then(async () => {
			// 		this.getList();
			// 		this.$modal.msgSuccess("撤回成功");
			// 	}).finally(() => {
			// 		this.loading = false;
			// 	});
			// },
			// // 查看
			// handleView(row) {
			// 	console.log('handleView====', row)
			// 	uni.navigateTo({
			// 		url: `/pages/business/travel/travelDetails?type=view&id=${row.id}`
			// 	});
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
			// 		return delTravel(id);
			// 	}).then(() => {
			// 		that.loading = false;;
			// 		that.getList();
			// 		that.$modal.msgSuccess("删除成功")
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
