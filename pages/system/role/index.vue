<template>
	<view class="form_list">
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新增角色','角色管理']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			<roleEdit ref="roleEditRef"></roleEdit>
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
					<uni-forms :modelValue="queryParams" label-width='80px' label-align='right'>
						<uni-forms-item label="角色名称">
							<uni-easyinput type="text" v-model="queryParams.roleName" placeholder="请输入角色名称" />
						</uni-forms-item>
						<uni-forms-item label="权限字符">
							<uni-easyinput type="text" v-model="queryParams.roleKey" placeholder="请输入权限字符" />
						</uni-forms-item>
						<uni-forms-item label="状态">
							<!-- <uni-easyinput type="text" v-model="queryParams.status" placeholder="角色状态" /> -->
							<uni-data-select
							  v-model="queryParams.status"
							  :localdata="sys_normal_disable"
							></uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="创建时间">
							<uni-datetime-picker v-model="dateRange" type="datetimerange" rangeSeparator="至" />
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
				title="角色名称:  +roleName"
				:hasStatus="false"
				:list="roleList"
				username="createBy"
				:content="contentList"
				@click="(item) => handleUpdate(item)"
			></FormListContent>
			
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>

		<!-- 操作按钮 -->
		<!-- <uni-row class="demo-uni-row example row_buttom" :gutter="10">
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

		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">角色名称</uni-th>
					<uni-th align="center">权限字符</uni-th>
					<uni-th align="center">显示顺序</uni-th>
					<uni-th align="center">状态</uni-th>
					<uni-th align="center">创建时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in roleList" :key="index">
					<uni-td align="center">{{ item.roleName }}</uni-td>
					<uni-td align="center">{{ item.roleKey }}</uni-td>
					<uni-td align="center">{{ item.roleSort }}</uni-td>
					<uni-td align="center">
						<u-switch v-model="item.status" @change="changeStatus(index)" active-value="0"
							inactive-value="1"></u-switch>
					</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary"
								@click="handleUpdate(item)">修改</button>
							<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)">删除</button>
							<button class="uni-button line-blue" size="mini" @click="handleDataScope(item)">数据权限</button>
							<button class="uni-button line-blue" size="mini" @click="handleAuthUser(item)">分配用户</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table> -->
			
		<!-- </view> -->

	</view>
</template>

<script>
	import roleEdit from './roleEdit'
	import {
		listRole,
		getRole,
		delRole,
		addRole,
		updateRole,
		dataScope,
		changeRoleStatus
	} from "@/api/system/role";
	export default {
		components: {
			roleEdit
		},
		data() {
			return {
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					roleName: undefined,
					roleKey: undefined,
					status: undefined
				},
				// 日期范围
				dateRange: [],
				// 单选数据源
				sys_normal_disable:[],

				// 角色表格数据
				loading: false,
				roleList: [],
				contentList:[
					{
						label: '权限字符',
						prop: 'roleKey',
					},
					{
						label: '是否启用',
						prop: 'status',
						dict:{
							0:'是',
							1:'否'
						}
					},
					{
						label: '创建时间',
						prop: 'createTime',
					},
				],
				total: 0,
				
				// 多选
				selectedIndexs: '',
				ids: [],
				
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
			/** 查询角色列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
					this.roleList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = [];
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					roleName: undefined,
					roleKey: undefined,
					status: undefined
				}
				this.handleQuery();
			},
			// 滑块事件
			changeStatus(index) {
				const tableData = this.roleList[index]
				let that = this
				let text = tableData.status === "0" ? "启用" : "停用";
				console.log('tableData==》',tableData)
				uni.showModal({
					title: '提示',
					content: '确认要"' + text + '""' + tableData.roleName + '"角色吗？',
					success: function(res) {
						if (res.confirm) {
							that.$modal.msgSuccess(text + "成功");
							return changeRoleStatus(tableData.roleId, tableData.status);
						} else if (res.cancel) {
							that.roleList[index].status = tableData.status === "0" ? "1" : "0";
						}
					}
				});
			},
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.roleList[i])
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.roleList[item].roleId
				})
				console.log(this.ids)
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},
			
			handleAdd(){
				uni.navigateTo({
					url: `/pages/system/role/roleEdit?type=add`
				});
			},
			handleUpdate(row){
				const roleId = row.roleId || this.ids[0];
				console.log('edit-->', roleId)
				uni.navigateTo({
					url: `/pages/system/role/roleEdit?type=edit&&id=${roleId}`
				});
			},
			// handleDataScope(row){
			// 	const title = `分配数据权限`
			// 	getRole(row.roleId).then(response => {
			// 		this.$refs.DataPermissionsRef.init(false, title, row, response.data)
			// 	});
			// },
			// Sub(form , row){
			// 	if (form.roleId != undefined) {
				  
			// 	  dataScope(form).then(response => {
			// 	    this.$modal.msgSuccess("修改成功");
			// 	  });
			// 	}
			// },
			/** 删除按钮操作 */
			// handleDelete(row) {
			// 	const roleIds = row.roleId || this.ids;
			// 	this.$modal.confirm('是否确认删除用户编号为"' + roleIds + '"的数据项？').then(function() {
			// 		return delRole(roleIds);
			// 	}).then(() => {
			// 		this.getList();
			// 		this.$modal.msgSuccess("删除成功");
			// 	}).catch(() => {});
			// },
			
			/** 分配用户操作 */
			// handleAuthUser: function(row) {
			// 	const roleId = row.roleId;
			// 	this.$tab.navigateTo("/pages/system/role/authUser?id=" + roleId);
			// },
		},
		mounted() {},
		async created() {
			this.selectedIndexs = []
			this.sys_normal_disable = await this.$getDictsList("sys_normal_disable")
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

<style scoped lang="scss">

</style>
