<template>
	<view class="form_list">
		
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新增字典','字典管理']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			<dictDetails ref="dictDetailsRef"></dictDetails>
		</view>
		
		<view v-if="current === 1">
		<!-- 查询条件 -->
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="false">
				<template v-slot:title>
					<uni-list>
						<uni-list-item title="搜索" :show-extra-icon="true"
							:extra-icon="{	color: '#0081ff',	size: '20',	type: 'search'}" />
					</uni-list>
				</template>

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="字典名称">
							<uni-easyinput type="text" v-model="queryParams.dictName" placeholder="请输入字典名称" />
						</uni-forms-item>
						<uni-forms-item label="字典类型">
							<uni-easyinput type="text" v-model="queryParams.dictType" placeholder="请输入字典类型" />
						</uni-forms-item>
						<uni-forms-item label="状态">
							<uni-data-select v-model="queryParams.status" :localdata="act_statusLists"
								placeholder="字典状态">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="创建时间">
							<uni-datetime-picker v-model="dateRange" type="datetimerange" rangeSeparator="至" />
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
		
		<!-- 列表数据 -->
			<FormListContent
				title="字典名称: +dictName"
				:list="dictList"
				:content="contentList"
				username="updateBy"
				:dictTag="{
					dict: act_statusList,
					value: 'status',
				}"
				@click="(item) => handleUpdate(item)"
			></FormListContent>
			
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
		<!-- 操作按钮 -->
		<!-- <uni-row class="demo-uni-row example" :gutter="10">
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
			<uni-col :span="2.5">
				<button @click="handleRefreshCache" class="cu-btn sm block line-green">
					<text class="cuIcon-refresh"></text> 刷新
				</button>
			</uni-col>
		</uni-row> -->
		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">字典编号</uni-th>
					<uni-th align="center">字典名称</uni-th>
					<uni-th align="center">字典类型</uni-th>
					<uni-th align="center">状态</uni-th>
					<uni-th align="center">备注</uni-th>
					<uni-th align="center">创建时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in dictList" :key="index">
					<uni-td align="center">{{ item.dictId }}</uni-td>
					<uni-td align="center">{{ item.dictName }}</uni-td>
					<uni-td align="center" style="color:cornflowerblue">
						<span @click="typeDetail(item)">{{item.dictType}}</span>
					</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.remark }}</uni-td>
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
		</view> -->


	</view>
</template>

<script>
	import dictDetails from './dictDetails'
	import {
		listType,
		delType,
		refreshCache
	} from "@/api/system/dict/type";
	import {
		checkPermi,
		checkRole
	} from "@/utils/permission"; // 权限判断函数
	import processAip from "@/api/workflow/processInst";
	export default {
		components: {
			dictDetails
		},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					dictName: undefined,
					dictType: undefined,
					status: undefined
				},
				total: 0,
				act_statusList: [],
				act_statusLists: [{
					text: '正常',
					value: "0",
					disable: false,

				}, {
					text: '停用',
					value: "1",
					disable: false,
				}],
				ids: [],

				// 遮罩层
				loading: true,
				// 请假业务表格数据
				dictList: [],
				contentList:[
					{
						label: '字典编码',
						prop: 'dictId',
					},
					{
						label: '字段类型',
						prop: 'dictType',
					},
					{
						label: '备注',
						prop: 'remark',
					},
				],
				dateRange: [],
				
				// 分段器
				current: 0,
				colorIndex: 0,
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
				this.ids = e.detail.index.map(item => {
					return this.dictList[item].dictId
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
					dictName: undefined,
					dictType: undefined,
					status: undefined
				}
				this.dateRange = []
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询字典列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listType(this.queryParams).then(response => {
					console.log('字典=>', response)
					this.dictList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 新增按钮操作 */
			handleAdd() {
				uni.navigateTo({
					url: `pages/system/dict/dictDetails?type=add`
				});
			},
			// 字典类型详情
			typeDetail(row){
				console.log('===========>111',row.dictId)
				const id = row.dictId
				uni.navigateTo({
					url: `pages/system/dict/data?id=${id}`
				});
			},
			// 修改事件
			handleUpdate(row) {
				console.log('handleUpdate====', row)
				const id = row.dictId || this.ids[0];
				console.log('edit-->', id)
				if (!id) {
					this.$modal.msgError("请选择数据!");
					return
				}
				uni.navigateTo({
					url: `pages/system/dict/dictDetails?type=edit&id=${id}`
				});
			},
			/** 刷新缓存按钮操作 */
			handleRefreshCache() {
				refreshCache().then(() => {
					this.$modal.msgSuccess("刷新成功");
				});
			},
			// 删除
			/* handleDelete(row) {
				const id = row.dictId || this.ids;
				// console.log('handleDelete====',id)
				if (id == "") {
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delType(id);
				}).then(() => {
					that.loading = false;;
					that.getList();
					that.$modal.msgSuccess("删除成功")
				}).catch(() => {
					that.loading = false;
				});
			}, */
		},
		created() {
			this.ids = []
			this.$getDicts("sys_normal_disable").then(res => {
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

<style>

</style>
