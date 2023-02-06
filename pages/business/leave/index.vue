<template>
	<view class="form_list">

		<!-- 操作按钮 -->
		<!-- <uni-row class="demo-uni-row example" :gutter="10">
			<uni-col :span="2.5">
				<button @click="handleAdd" class="cu-btn sm block line-blue">
					<text class="cuIcon-add"></text> 新增
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="handleUpdate" class="cu-btn sm block line-green">
					<text class="cuIcon-edit"></text> 修改
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="handleDelete" class="cu-btn sm block line-red">
					<text class="cuIcon-delete"></text> 删除
				</button>
			</uni-col>
		</uni-row> -->

		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-show="current === 0">
			<leaveDetail ref="leaveDetailRef"></leaveDetail>
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
							<uni-forms-item label="请假类型">
								<uni-data-select v-model="queryParams.leaveType" :localdata="bs_leave_type">
								</uni-data-select>
							</uni-forms-item>
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
			<!-- <uni-list :border="true" class="form_list_content">
				<uni-list-item :border="true" uni_border_color="#a6a6a6" clickable v-for="(item,index) in leaveList"
					:key="index" :rightText="item.createTime"
					:to="`/pages/business/leave/leaveDetail?type=view&id=${item.id}`">
					
					<template v-slot:body>
						<view class="slot-body">
							<view class="list_title ">
								<uni-title type="h3" :title="item.title"></uni-title>
								<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status"></DictTag>
							</view>
							<view class="list_body">
								<view class="list_body_content">请假类型: {{ dictList[item.leaveType] }}
									<DictTag :dict="dictList" :value="item.leaveType"></DictTag>
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
			</uni-list> -->
			<FormListContent 
				:list="leaveList"
				:content="contentList"
				to="/pages/business/leave/leaveDetail"
			></FormListContent>
			
		</view>



		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">申请人</uni-th>
					<uni-th align="center">请假时长</uni-th>
					<uni-th align="center">工作委托人</uni-th>
					<uni-th align="center">联系电话</uni-th>
					<uni-th align="center">请假类型</uni-th>
					<uni-th align="center">标题</uni-th>
					<uni-th align="center">请假原因</uni-th>
					<uni-th align="center">请假开始时间</uni-th>
					<uni-th align="center">请假结束时间</uni-th>
					<uni-th align="center" width="80">流程状态</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in leaveList" :key="index">
					<uni-td align="center">{{ item.username }}</uni-td>
					<uni-td align="center">{{ item.duration }}</uni-td>
					<uni-td align="center">{{ item.principal }}</uni-td>
					<uni-td align="center">{{ item.contactPhone }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="dictList" :value="item.leaveType"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.title }}</uni-td>
					<uni-td align="center">{{ item.leaveReason }}</uni-td>
					<uni-td align="center">{{ item.startDate }}</uni-td>
					<uni-td align="center">{{ item.endDate }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						<TabelButton :params="item" :status="item.actBusinessStatus.status" @update="handleUpdate(item)"
							@cancel="cancelProcessApply(item)" @view="handleView(item)" @delete="handleDelete(item)">
						</TabelButton>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view> -->

		<!-- <InnerTabbar></InnerTabbar> -->

	</view>
</template>

<script>
	import leaveDetail from './leaveDetail'
	import {
		listLeave,
		getLeave,
		delLeave,
		addLeave,
		updateLeave,
		uploadfile,
		fallbackUserDays
	} from "@/api/demo/leave";
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	import processAip from "@/api/workflow/processInst";
	export default {
		components: {
			leaveDetail
		},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					username: undefined,
					duration: undefined,
					leaveType: undefined,
					title: undefined
				},
				total: 0,
				bs_leave_type: [],
				dictList: {},
				act_statusList: [],
				ids: [],

				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				contentList:[
					{
						label: '请假类型',
						prop: 'leaveType',
						dict: {}
					},
					{
						label: '开始时间',
						prop: 'startDate',
					},
					{
						label: '结束时间',
						prop: 'endDate',
					}
				],

				// 分段器
				current: 0,
				colorIndex: 0,
			}
		},
		methods: {
			// 回退事件
			verifyCancel(){
				this.$refs.leaveDetailRef.verifyCancel()
			},	
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			// 选择人员
			confirmSysDeptUser(data){
				this.$refs.leaveDetailRef.confirmSysDeptUser(data)
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.ids.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.leaveList[item].id
				})
				console.log('ids==>', this.ids)
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
					username: undefined,
					duration: undefined,
					leaveType: undefined,
					title: undefined
				}
				this.handleQuery();
			},
			/** 查询请假业务列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listLeave(this.queryParams).then(response => {
					// console.log('请假列表==>', response)
					this.leaveList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			//  新增按钮操作
			/* handleAdd() {
				uni.navigateTo({
					url: `/pages/business/leave/leaveDetail?type=add`
				});
			},
			修改事件
			handleUpdate(row) {
				console.log('handleUpdate====', row)
				const id = row.id || this.ids[0];
				console.log('edit-->', id)
				if (!id) {
					this.$modal.msgError("请选择数据!");
					return
				}
				uni.navigateTo({
					url: `/pages/business/leave/leaveDetail?type=edit&id=${id}`
				});
			}, */

			// 查看
			/* handleView(row) {
				console.log('handleView====', row)
				uni.navigateTo({
					url: `/pages/business/leave/leaveDetail?type=view&id=${row.id}`
				});
			}, */
			// 删除
			/* handleDelete(row) {
				const id = row.id || this.ids;
				// console.log('handleDelete====',id)
				if (id == "") {
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delLeave(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					that.getList();
				}).catch(() => {
					that.loading = false;
				});
			}, */
		},
		created() {
			this.ids = []
			this.$getDicts("bs_leave_type").then(res => {
				res.data.forEach(ele => {
					// this.dictList[ele.dictValue] = ele.dictLabel
					this.contentList[0].dict[ele.dictValue] = ele.dictLabel
				})
				this.bs_leave_type = res.data.map(ele => {
					return {
						text: ele.dictLabel,
						value: ele.dictValue
					}
				});
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
	
</style>
