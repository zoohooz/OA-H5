<template>
	<view>
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black"
			@clickItem="onClickItem" />
		
		<view v-show="current === 0">
			<noticeDetails @refreshList="refreshList"></noticeDetails>
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
							<uni-forms-item label="公告标题">
								<uni-easyinput type="text" v-model="queryParams.noticeTitle" placeholder="请输入公告标题" />
							</uni-forms-item
							<uni-forms-item label="类型">
								<uni-data-select v-model="queryParams.noticeType" :localdata="act_statusLists"
									placeholder="公告类型">
								</uni-data-select>
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
					:to="`/pages/system/notice/noticeDetails?type=edit&id=${item.noticeId}`">
					<template v-slot:body>
						<view class="slot-body">
							<view class="list_title ">
								<uni-title type="h3" :title="item.noticeTitle"></uni-title>
							</view>
							<view class="list_body">
								<view class="list_body_content">状态:
								<DictTag :dict="notice_status" :value="item.status"></DictTag></view>
								<view class="list_body_content">公告类型：
								{{item.noticeType==='1'?'通知':'公告'}}
								</view>
							</view>
						</view>
					</template>
		
					<template v-slot:footer>
						<view class="list_footer">
							<text>{{item.createTime}}</text>
							<text>创建者：{{item.createBy}}</text>
						</view>
					</template>
		
				</uni-list-item>
			</uni-list>
		
		</view>




		<!-- 查询条件 -->
		<!-- <uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="true">

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="公告标题">
							<uni-easyinput type="text" v-model="queryParams.noticeTitle" placeholder="请输入公告标题" />
						</uni-forms-item>
						<uni-forms-item label="操作人员">
							<uni-easyinput type="text" v-model="queryParams.createBy" placeholder="请输入操作人员" />
						</uni-forms-item>
						<uni-forms-item label="类型">
							<uni-data-select v-model="queryParams.noticeType" :localdata="act_statusLists"
								placeholder="公告类型">
							</uni-data-select>
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
					<uni-th align="center">序号</uni-th>
					<uni-th align="center">公告8标题</uni-th>
					<uni-th align="center">公告类型</uni-th>
					<uni-th align="center">状态</uni-th>
					<uni-th align="center">创建者</uni-th>
					<uni-th align="center">创建时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.noticeId }}</uni-td>
					<uni-td align="center">{{ item.noticeTitle }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.noticeType" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						<DictTag :dict="notice_status" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						{{item.createBy}}
					</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<view class="uni-group">
								<button class="uni-button" size="mini" type="primary" style="margin-right: 3px;"
									@click="handleUpdate(item)">修改</button>
								<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)"
									style="margin-right: 3px;">删除</button>
							</view>
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
	import noticeDetails from './noticeDetails'
	import {
		listNotice,
	} from "@/api/system/notice";
	export default {
		components: {
			noticeDetails
		},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					noticeTitle: undefined,
					createBy: undefined,
					status: undefined
				},
				total: 0,
				act_statusList: [],
				notice_status: [],
				act_statusLists: [{
					text: '通知	',
					value: "1",
					disable: false,

				}, {
					text: '公告',
					value: "2",
					disable: false,
				}],
				ids: [],
				// 类型数据字典
				typeOptions: [],
				// 默认字典类型
				defaultDictType: "",
				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				dateRange: [],
				current: 0
			}
		},
		methods: {
			refreshList() {
				this.getList()
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
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
					pageSize: 10,
					noticeTitle: undefined,
					createBy: undefined,
					status: undefined
				}
				this.handleQuery();
			},
			/** 查询通知公告列表 */
			getList() {
				this.loading = true;
				listNotice(this.queryParams).then(response => {
					console.log('通知公告列表=>', response)
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
			// 		return this.leaveList[item].noticeId
			// 	})
			// 	console.log('ids==>', this.ids)
			// },
			// /** 新增按钮操作 */
			// handleAdd() {
			// 	uni.navigateTo({
			// 		url: `pages/system/notice/noticeDetails?type=add`
			// 	});
			// },
			// // 修改事件
			// handleUpdate(row) {
			// 	console.log('handleUpdate====', row)
			// 	const id = row.noticeId || this.ids[0];
			// 	console.log('edit-->', id)
			// 	if (!id) {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url: `pages/system/notice/noticeDetails?type=edit&id=${id}`
			// 	});
			// },
			// // 删除
			// handleDelete(row) {
			// 	const id = row.noticeId || this.ids;
			// 	// console.log('handleDelete====',id)
			// 	if (id == "") {
			// 		this.$modal.msgError("请选择数据!");
			// 		return
			// 	}
			// 	let that = this
			// 	that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
			// 		that.loading = true;
			// 		return delNotice(id);
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
			this.$getDicts("sys_notice_type").then(res => {
				this.act_statusList = res.data
			});
			this.$getDicts("sys_notice_status").then(res => {
				this.notice_status = res.data
			});

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			console.log('页面显示')
			this.getList()},
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
