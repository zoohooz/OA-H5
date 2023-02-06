<template>
	<view class="form_list">
		
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新增用户','用户管理']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			<userEdit ref="userEditRef"></userEdit>
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
						<uni-forms-item label="用户名称">
							<uni-easyinput type="text" v-model="queryParams.userName" placeholder="请输入用户名称" />
						</uni-forms-item>
						<uni-forms-item label="手机号码">
							<uni-easyinput type="text" v-model="queryParams.phonenumber" placeholder="请输入手机号码" />
						</uni-forms-item>
						<uni-forms-item label="创建时间">
							<uni-datetime-picker v-model="dateRange" type="datetimerange" rangeSeparator="至" />
						</uni-forms-item>
						<uni-forms-item label="部门">
							<DeptSelect @confirm="confirm" ></DeptSelect>
							<!-- <uni-easyinput v-model="deptLabel" disabled />
							<button @click="handleDept" size="mini" >选择部门</button> -->
						</uni-forms-item>
						
						<!-- 搜索按钮 -->
						<uni-row class="search_button" :gutter="12">
							<uni-col :span="12">
								<button @click="reset" form-type="reset">重置</button>
							</uni-col>
							<uni-col :span="12">
								<button @click="submitForm" form-type="submit" type="primary">搜索</button>
							</uni-col>
						</uni-row>

					</uni-forms>

				</view>

			</uni-collapse-item>
		</uni-collapse>
		
		<!-- 列表数据 -->
			<FormListContent
				title="nickName"
				:hasStatus="false"
				:list="userList"
				username="userName"
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
					<uni-th align="center">用户名称</uni-th>
					<uni-th align="center">用户昵称</uni-th>
					<uni-th align="center">部门</uni-th>
					<uni-th align="center">手机号码</uni-th>
					<uni-th align="center">在职状态</uni-th>
					<uni-th align="center">是否转正</uni-th>
					<uni-th align="center">创建时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in userList" :key="index">
					<uni-td align="center">{{ item.userName }}</uni-td>
					<uni-td align="center">{{ item.nickName }}</uni-td>
					<uni-td align="center">{{ item.dept ? item.dept.deptName : '' }}</uni-td>
					<uni-td align="center">{{ item.phonenumber }}</uni-td>
					<uni-td align="center">
						<switch class='blue'  :class="!-item.status?'checked':''" :checked="!-item.status" @change="changeStatus(index)" />
						<u-switch v-model="item.status" @change="changeStatus(index)" active-value="0"
							inactive-value="1"></u-switch>
						{{ Boolean(!-item.status) }}
					</uni-td>
					<uni-td align="center">{{ item.positiveState }}</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary"
								@click="handleUpdate(item)">修改</button>
							<button class="uni-button line-blue" size="mini" @click="handleResetPwd(item)">重置密码</button>
							<button class="uni-button line-blue" size="mini" @click="handleAuthRole(item)">分配角色</button>
							<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table> 
			
		</view>-->

	</view>
</template>

<script>
	import userEdit from './userEdit'
	import {
		listUser,
		getUser,
		delUser,
		addUser,
		updateUser,
		resetUserPwd,
		changeUserStatus
	} from "@/api/system/user";
	
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
	export default {
		components: {
			userEdit,
			DeptSelect
		},
		data() {
			return {
				queryParams: {
					userName: '',
					phonenumber: '',
					status: '',

					pageNum: 1,
					pageSize: 10,
				},
				dateRange: [],
				// table
				loading: false,
				userList: [],
				contentList:[
					{
						label: '部门',
						prop: 'dept.deptName',
					},
					{
						label: '在职状态',
						prop: 'status',
						dict:{
							0:'是',
							1:'否'
						}
					},
					{
						label: '是否转正',
						prop: 'positiveState',
					},
				],
				total: 0,

				selectedIndexs: '',

				// add
				postOptions: '',
				roleOptions: '',
				// 
				ids: [],
				
				// 分段器
				current: 0,
				colorIndex: 0,
			}
		}, //data
		created() {
			this.selectedIndexs = []
		},
		onShow() {
			this.getList()
			// this.getConfigKey("sys.user.initPassword").then(response => {
			// 	this.initPassword = response.msg;
			// });
		},
		methods: {	
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
			},
			// 部门选择
			confirm(e){
				console.log('部门选择',e)
				this.queryParams.deptId = e[0].id
				this.getList()
			},
			
			reset() {
				this.dateRange = [];
				this.queryParams = {
					userName: '',
					phonenumber: '',
					status: '',
					deptId: undefined,
					userId: undefined,

					pageNum: 1,
					pageSize: 10,
				}
				this.getList()
			},
			// 滑块事件
			changeStatus(index) {
				const tableData = this.userList[index]
				let that = this
				let text = tableData.status === "0" ? "启用" : "停用";
				uni.showModal({
					title: '提示',
					content: '确认要"' + text + '""' + tableData.userName + '"用户吗？',
					success: function(res) {
						if (res.confirm) {
							that.$modal.msgSuccess(text + "成功");
							return changeUserStatus(tableData.userId, tableData.status);
						} else if (res.cancel) {
							that.userList[index].status = tableData.status === "0" ? "1" : "0";
						}
					}
				});
			},
			submitForm() {
				this.getList()
			},
			getList() {
				this.loading = true;
				listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
					this.userList = response.rows;
					this.total = response.total;
					this.loading = false;
					console.log('response123=>', response);
					for (let index = 0; index < this.userList.length; index++) {
						if (this.userList[index].positiveState == 1) {
							this.userList[index].positiveState = '试用期'
						} else if (this.userList[index].positiveState == 2) {
							this.userList[index].positiveState = '正式员工'
						}
					}
					this.loading = false;
				});
			},

			// 多选处理
			selectedItems() {
				console.log(this.selectedIndexs.map(i => this.userList[i]))
				return this.selectedIndexs.map(i => this.userList[i])
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.userList[item].userId
				})
				// this.selectedIndexs = e.detail.index
				console.log(this.ids)
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.queryParams.pageNum = e.current
				this.getList()
			},

			/** 新增按钮操作 */
			handleAdd() {
				uni.navigateTo({
					url: '/pages/system/user/userEdit'
				});
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				const userId = row.userId || this.ids[0];
				console.log('edit-->', userId)
				uni.navigateTo({
					url: `/pages/system/user/userEdit?type=edit&&id=${userId}`
				});
			},
			/** 删除按钮操作 */
			// handleDelete(row) {
			// 	const userIds = row.userId || this.ids;
			// 	this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
			// 		return delUser(userIds);
			// 	}).then(() => {
			// 		this.getList();
			// 		this.$modal.msgSuccess("删除成功");
			// 	}).catch(() => {});
			// },

			/** 重置密码按钮操作 */
			// handleResetPwd(row) {
			// 	const title = `请输入${row.userName}的新密码`
			// 	this.$refs.PasswordEditRef.init(false, title, row)
			// },
			// pwdSub(e, row) {
			// 	console.log(e, row)
			// 	resetUserPwd(row.userId, e).then(response => {
			// 		this.$modal.msgSuccess("修改成功，新密码是：" + e);
			// 	});
			// },
			/** 分配角色操作 */
			// handleAuthRole: function(row) {
			// 	const userId = row.userId;
			// 	this.$router.push("/pages/system/user/authRole?id=" + userId);
			// },


		}
	}
</script>

<style>
	.example {
		padding: 15px;
	}

	.forms_footer {
		display: flex;
	}

	.uni-group {
		display: flex;
		align-items: center;
	}
</style>
