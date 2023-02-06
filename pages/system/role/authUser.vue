<template>
	<view class="">
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

						<!-- 搜索按钮 -->
						<uni-row class="search_button" :gutter="12">
							<uni-col :span="12">
								<button @click="reset" form-type="reset">重置</button>
							</uni-col>
							<uni-col :span="12">
								<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
							</uni-col>
						</uni-row>

					</uni-forms>
				</view>

			</uni-collapse-item>
		</uni-collapse>
		
		<!-- 操作按钮 -->
		<!-- <uni-row class="demo-uni-row example row_buttom" :gutter="10">
			<uni-col :span="2.5">
				<button @click="openSelectUser" class="cu-btn sm block line-blue">
					<text class="cuIcon-add"></text> 添加用户
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="cancelAuthUserAll" class="cu-btn sm block line-red">
					<text class="cuIcon-roundclose"></text> 批量取消授权
				</button>
			</uni-col>
			<uni-col :span="2.5">
				<button @click="handleClose" class="cu-btn sm block line-orange">
					<text class="cuIcon-close"></text> 关闭
				</button>
			</uni-col>
		</uni-row> -->
		
		<!-- 表格数据 -->
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				>
				<uni-tr>
					<!-- <uni-th align="center">用户名称</uni-th> -->
					<uni-th align="center" width="80">用户昵称</uni-th>
					<!-- <uni-th align="center">邮箱</uni-th> -->
					<!-- <uni-th align="center">手机</uni-th> -->
					<uni-th align="center" width="80">状态</uni-th>
					<!-- <uni-th align="center" width="80">创建时间</uni-th> -->
					<uni-th align="center" width="80">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in userList" :key="index">
					<!-- <uni-td align="center">{{ item.userName }}</uni-td> -->
					<uni-td align="center">{{ item.nickName }}</uni-td>
					<!-- <uni-td align="center">{{ item.email }}</uni-td> -->
					<!-- <uni-td align="center">{{ item.phonenumber }}</uni-td> -->
					<uni-td align="center">
						<DictTag :dict="sys_normal_disableList" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<!-- <uni-td align="center">{{ item.createTime }}</uni-td> -->
					<uni-td>
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary"
								@click="cancelAuthUser(item)">取消授权</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
		
		<view class="form_sub_button">
			<button class="uni-button line-red" @click="cancelAuthUserAll" >批量取消授权</button>
			<button class="uni-button line-blue" @click="openSelectUser">添加用户</button>
		</view>
		
		 
	</view>
</template>

<script>
import { allocatedUserList, authUserCancel, authUserCancelAll } from "@/api/system/role";
	export default {
		components: {},
		data() {
			return {
				// 查询参数
				queryParams: {
				 pageNum: 1,
					pageSize: 10,
					roleId: undefined,
					userName: undefined,
					phonenumber: undefined
				},
				
				// table
				loading: false,
				userList: [],
				total: 0,
				
				selectedIndexs: '',
				ids: [],
				
				sys_normal_disableList:[],
			}
		},
		methods: {
			/** 搜索按钮操作 */
			    handleQuery() {
			      this.queryParams.pageNum = 1;
			      this.getList();
			    },
			/** 重置按钮操作 */
			    reset() {
			      this.queryParams = {
								pageNum: 1,
								pageSize: 10,
								roleId: this.queryParams.roleId,
								userName: undefined,
								phonenumber: undefined
							}
							this.$refs.table.clearSelection()
			      this.handleQuery();
			    },
			/** 查询授权用户列表 */
			getList() {
				this.$refs?.table?.clearSelection()
			  this.loading = true;
			  allocatedUserList(this.queryParams).then(response => {
			      this.userList = response.rows;
			      this.total = response.total;
			      this.loading = false;
			    }
			  );
			},
			/** 取消授权按钮操作 */
			cancelAuthUser(row) {
			  const roleId = this.queryParams.roleId;
			  this.$modal.confirm('确认要取消该用户"' + row.userName + '"角色吗？').then(function() {
			    return authUserCancel({ userId: row.userId, roleId: roleId });
			  }).then(() => {
			    this.getList();
			    this.$modal.msgSuccess("取消授权成功");
			  }).catch(() => {});
			},
			/** 批量取消授权按钮操作 */
			cancelAuthUserAll(row) {
			  const roleId = this.queryParams.roleId;
			  const userIds = this.ids.join(",");
			  this.$modal.confirm('是否取消选中用户授权数据项？').then(function() {
			    return authUserCancelAll({ roleId: roleId, userIds: userIds });
			  }).then(() => {
			    this.getList();
			    this.$modal.msgSuccess("取消授权成功");
			  }).catch(() => {});
			},
			openSelectUser(){
				const roleId = this.queryParams.roleId;
				this.$tab.navigateTo("/pages/system/role/selectUser?id=" + roleId);
			},
			
			handleClose(){
				this.$tab.navigateBack(1)
			},
			
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.userList[i])
			},
			// 多选
			selectionChange(e) {
				this.ids = e.detail.index.map(item => {
					return this.userList[item].userId
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
			
		},
		mounted() {},
		async created() {
			await this.$getDicts("sys_normal_disable").then(res => {
				this.sys_normal_disableList = res.data
			});
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			console.log('分配用户---', option)
			//页面初次渲染完成
			const roleId = option.id
			if (roleId) {
			  this.queryParams.roleId = roleId;
			  this.getList();
			}
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
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
