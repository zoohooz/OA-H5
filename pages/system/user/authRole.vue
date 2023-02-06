<template>
	<view class="user_css">
		<uni-collapse accordion>
			<uni-collapse-item title="基本信息" :open="true">

				<view class="example">
					<uni-forms :modelValue="form" label-width='80px' label-align='right'>
						<uni-row class="demo-uni-row example" :gutter="10">
							<uni-col :span="12">
								<uni-forms-item label="用户昵称">
									<uni-easyinput disabled v-model="form.nickName" placeholder="用户昵称" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="12">
								<uni-forms-item label="登录账号">
									<uni-easyinput disabled v-model="form.userName" placeholder="登录账号" />
								</uni-forms-item>
							</uni-col>
						</uni-row>
					</uni-forms>
					
					<uni-row class="demo-uni-row">
						<uni-col :span="12">
							<button @click="reset" >返回</button>
						</uni-col>
						<uni-col :span="12">
							<button @click="submitForm"  type="primary">提交</button>
						</uni-col>
					</uni-row>
				</view>

			</uni-collapse-item>
		</uni-collapse>

		<uni-section title="角色信息" type="line"></uni-section>

		<!-- 表格数据 -->
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<!-- <uni-th align="center">序号</uni-th> -->
					<!-- <uni-th align="center">角色编号</uni-th> -->
					<uni-th align="center" width="80">角色名称</uni-th>
					<uni-th align="center" width="80">权限字符</uni-th>
					<uni-th align="center" width="80">创建时间</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in roles " :key="index">
					<!-- <uni-td align="center">{{ index + 1 }}</uni-td> -->
					<!-- <uni-td align="center">{{ item.roleId }}</uni-td> -->
					<uni-td align="center">{{ item.roleName }}</uni-td>
					<uni-td align="center">{{ item.roleKey }}</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<!-- <uni-td >
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary" @click="handleUpdate(item)">修改</button>
							<button class="uni-button line-blue" size="mini" @click="handleResetPwd(item)">重置密码</button>
							<button class="uni-button line-blue" size="mini" @click="handleAuthRole(item)">分配角色</button>
							<button class="uni-button" size="mini" type="warn" @click="handleDelete(item)">删除</button>
						</view>
					</uni-td> -->
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="pageSize" :current="pageNum" :total="total" @change="change" />
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getAuthRole,
		updateAuthRole
	} from "@/api/system/user";

	export default {
		components: {},
		data() {
			return {
				// / / / 遮罩层
				loading: true,
				// 分页信息
				total: 0,
				pageNum: 1,
				pageSize: 10,
				// 选中角色编号
				roleIds: [],
				// 角色信息
				roles: [],
				// 用户信息
				form: {}
			}
		},
		methods: {
			// 多选
			selectionChange(e) {
				this.roleIds = e.detail.index.map(item => {
					return this.roles[item].roleId
				})
				console.log(this.roleIds)
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.pageNum = e.current
				this.getList()
			},
			
			reset(){
				uni.navigateBack(-1)
			},
			submitForm(){
				const userId = this.form.userId;
				const roleIds = this.roleIds.join(",");
				updateAuthRole({ userId: userId, roleIds: roleIds }).then((response) => {
					this.$modal.msgSuccess("授权成功");
				});
			},

		},
		updated() {
			this.roles.forEach((row, index) => {
				if (row.flag) {
					this.$refs.table.toggleRowSelection(index);
				}
			});
		},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			const userId = option.id
			if (userId) {
				this.loading = true;
				getAuthRole(userId).then((response) => {
					console.log('分配角色---', response)
					this.form = response.data.user;
					this.roles = response.data.roles;
					this.total = this.roles.length;
					this.loading = false;
				});
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

<style>

</style>
