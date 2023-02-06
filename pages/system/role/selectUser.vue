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
		
		

		<!-- 表格数据 -->
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<!-- <uni-th align="center">用户名称</uni-th> -->
					<uni-th align="center" width="80">用户昵称</uni-th>
					<!-- <uni-th align="center">邮箱</uni-th> -->
					<!-- <uni-th align="center">手机</uni-th> -->
					<uni-th align="center" width="80">状态</uni-th>
					<uni-th align="center" width="80">创建时间</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in userList" :key="index">
					<!-- <uni-td align="center">{{ item.userName }}</uni-td> -->
					<uni-td align="center">{{ item.nickName }}</uni-td>
					<!-- <uni-td align="center">{{ item.email }}</uni-td> -->
					<!-- <uni-td align="center">{{ item.phonenumber }}</uni-td> -->
					<uni-td align="center">
						<DictTag :dict="sys_normal_disableList" :value="item.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>


		<view class="form_sub_button">
			<!-- <uni-col :span="12">
				<button @click="cancel" >取消</button>
			</uni-col> -->
			<!-- <uni-col :span="24"> -->
				<button @click="handleSelectUser"  type="primary">提交</button>
			<!-- </uni-col> -->
		</view>

	</view>
</template>

<script>
	import {
		unallocatedUserList,
		authUserSelectAll
	} from "@/api/system/role";
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

				// 选中数组值
				loading: false,
				userIds: [],
				// 总条数
				total: 0,
				// 未授权用户数据
				userList: [],
				
				selectedIndexs: [],
				ids: [],

				sys_normal_disableList: [],
			}
		},
		methods: {
			// 查询表数据
			getList() {
				unallocatedUserList(this.queryParams).then(res => {
					this.userList = res.rows;
					this.total = res.total;
				});
			},
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
				this.handleQuery();
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
			
			cancel(){
				this.$tab.navigateBack(1)
			},
			/** 选择授权用户操作 */
			    handleSelectUser() {
			      const roleId = this.queryParams.roleId;
			      const userIds = this.ids.join(",");
			      if (userIds == "") {
			        this.$modal.msgError("请选择要分配的用户");
			        return;
			      }
			      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
			        this.$modal.msgSuccess(res.msg);
			        if (res.code === 200) {
			          this.$tab.navigateBack(1)
			        }
			      });
			    },
			
		},
		mounted() {},
		created() {
			this.$getDicts("sys_normal_disable").then(res => {
				this.sys_normal_disableList = res.data
			});
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('options==>', option)
			this.queryParams.roleId = option.id
			this.getList();
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
