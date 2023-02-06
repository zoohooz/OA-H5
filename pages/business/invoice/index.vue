<template>
	<view>
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-show="current === 0">
			<invoiceDetails @refreshList="refreshList"></invoiceDetails>
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
								<uni-easyinput type="text" v-model="queryParams.supplierName" placeholder="请输入供应商名称" />
							</uni-forms-item>
							<uni-forms-item label="时间">
								<uni-datetime-picker v-model="dateRange" type="datetimerange" rangeSeparator="至" />
							</uni-forms-item>
							<uni-forms-item label="发票号码">
								<uni-easyinput type="text" v-model="queryParams.invoiceNumber" placeholder="请输入发票号码" />
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
					:key="index" :rightText="item.invoiceType"
					:to="`/pages/business/invoice/invoiceDetails?type=view&id=${item.invoiceId}`">
					
					<template v-slot:body>
						<view class="slot-body">
							<view class="list_title ">
								<uni-title type="h3" :title="item.vendorName"></uni-title>
							</view>
							<view class="list_body">
								<view class="list_body_content">开票时间: {{item.invoiceDate}}</view>
								<view class="list_body_content">收票时间: {{item.ticketCollectionTime}}</view>
							</view>
						</view>
					</template>
					
					<template v-slot:footer>
						<view class="list_footer">
							<text>发票类型：{{item.invoiceType}}</text>
							<text>发票号码：{{item.invoiceNumber}}</text>
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
							<uni-easyinput type="text" v-model="queryParams.supplierName" placeholder="请输入供应商名称" />
						</uni-forms-item>
						<uni-forms-item label="时间">
							<uni-datetime-picker v-model="dateRange" type="datetimerange" rangeSeparator="至" />
						</uni-forms-item>
						<uni-forms-item label="发票号码">
							<uni-easyinput type="text" v-model="queryParams.invoiceNumber" placeholder="请输入发票号码" />
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
					<uni-th align="center">供应商名称</uni-th>
					<uni-th align="center">发票号码</uni-th>
					<uni-th align="center">开票时间</uni-th>
					<uni-th align="center">发票面值</uni-th>
					<uni-th align="center">未付金额</uni-th>
					<uni-th align="center">是否付款</uni-th>
					<uni-th align="center">发票类型</uni-th>
					<uni-th align="center">收票时间</uni-th>
					<uni-th align="center">是否认证</uni-th>
					<uni-th align="center">业务备注</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.vendorName }}</uni-td>
					<uni-td align="center">{{ item.invoiceNumber }}</uni-td>
					<uni-td align="center">{{ item.invoiceDate }}</uni-td>
					<uni-td align="center">{{ item.faceValue }}</uni-td>
					<uni-td align="center">{{ item.amount }}</uni-td>
					<uni-td align="center">{{ item.payment=== 1 ? '是' : '否' }}</uni-td>
					<uni-td align="center">{{ item.invoiceType }}</uni-td>
					<uni-td align="center">{{ item.ticketCollectionTime }}</uni-td>
					<uni-td align="center">{{ item.authentication === 1 ? '是' : '否' }}</uni-td>
					<uni-td align="center">{{ item.businessRemarks }}</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary" style="margin-right: 3px;"
								@click="handleUpdate(item)">修改</button>
							<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)"
								style="margin-right: 3px;">删除</button>
							<button class="uni-button" size="mini" @click="handleView(item)">查看</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view> -->


	</view>
</template>

<script>
	import invoiceDetails from './invoiceDetails'
	import {
		listInvoice,
	} from "@/api/demo/invoice";
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	export default {
		components: {invoiceDetails},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 30,
					beginTime: undefined,
					endTime: undefined,
					vendorName: undefined,
					title: undefined
				},
				total: 0,
				ids: [],

				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				dateRange: [],
				current:0
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			refreshList(){
				console.log('121212112')
				this.getList()
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				if (this.dateRange?.length > 0) {
					({
						0: this.queryParams.beginTime,
						1: this.queryParams.endTime
					} = this.dateRange)
				} else {
					this.queryParams.beginTime = undefined
					this.queryParams.endTime = undefined
				}
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 30,
					beginTime: undefined,
					endTime: undefined,
					vendorName: undefined,
					title: undefined
				}
				this.dateRange = []
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询供发票管理列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listInvoice(this.queryParams).then(response => {
					console.log('发票==>', response)
					this.leaveList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 新增按钮操作 */
			handleAdd() {
				uni.navigateTo({
					url: `/pages/business/invoice/invoiceDetails?type=add`
				});
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			// // 多选
			// selectionChange(e) {
			// 	this.ids = e.detail.index.map(item => {
			// 		return this.leaveList[item].invoiceId
			// 	})
			// 	console.log('ids==>', this.ids)
			// },
			// // 修改事件
			// handleUpdate(row) {
			// 	console.log('handleUpdate====', row)
			// 	const id = row.invoiceId || this.ids[0];
			// 	console.log('edit', id)
			// 	if (!id) {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url: `/pages/business/invoice/invoiceDetails?type=edit&id=${id}`
			// 	});
			// },
			// // 查看
			// handleView(row) {
			// 	console.log('handleView====', row)
			// 	uni.navigateTo({
			// 		url: `/pages/business/invoice/invoiceDetails?type=view&id=${row.invoiceId}`
			// 	});
			// },
			// // 删除
			// handleDelete(row) {
			// 	const id = row.invoiceId || this.ids;
			// 	// console.log('handleDelete====',id)
			// 	if (id == "") {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	let that = this
			// 	that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
			// 		that.loading = true;
			// 		return delInvoice(id);
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
