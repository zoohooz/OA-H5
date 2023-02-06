<template>
	<view>
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="true">

				<view class="example">
					<uni-forms :modelValue="queryParams" label-width='80px' label-align='right'>
						<uni-forms-item label="登录地址">
							<uni-easyinput type="text" v-model="queryParams.ipaddr" placeholder="请输入登录地址" />
						</uni-forms-item>
						<uni-forms-item label="用户名称">
							<uni-easyinput type="text" v-model="queryParams.userName" placeholder="请输入用户名称" />
						</uni-forms-item>

						<uni-row class="demo-uni-row">
							<uni-row span="12">
								<button @click="resetQuery" form-type="reset">重置</button>
							</uni-row>
							<uni-row span="12">
								<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
							</uni-row>
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
					<!-- <uni-row align="center">用户编号</uni-row> -->
					<uni-th align="center" width="120">会话编号</uni-th>
					<uni-th align="center">登录名称</uni-th>
					<uni-th align="center">部门名称</uni-th>
					<uni-th align="center">主机</uni-th>
					<uni-th align="center">登录地点</uni-th>
					<uni-th align="center">浏览器</uni-th>
					<uni-th align="center" width="120">操作系统</uni-th>
					<uni-th align="center">登录时间</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in list" :key="index">
					<!-- <uni-td align="center">{{ item.userId }}</uni-td> -->
					<uni-td align="center" width="120" class="text_hidden">{{ item.tokenId }}</uni-td>
					<uni-td align="center">{{ item.userName }}</uni-td>
					<uni-td align="center">{{ item.deptName }}</uni-td>
					<uni-td align="center">{{ item.ipaddr }}</uni-td>
					<uni-td align="center">{{ item.loginLocation }}</uni-td>
					<uni-td align="center">{{ item.browser }}</uni-td>
					<uni-td align="center" style="word-break:break-all;">{{ item.os }}</uni-td>
					<uni-td align="center">{{ item.loginTime }}</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<button class="uni-button" size="mini" type="primary"
								@click="handleForceLogout(item)">强退</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="pageSize" :current="pageNum" :total="total" @change="change" />
			</view>
		</view>
		<!-- 表格结束 -->
	</view>
</template>

<script>
	import {
		list,
		forceLogout
	} from "@/api/monitor/online";
	export default {
		components: {},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 总条数
				total: 0,
				// 表格数据
				list: [],
				pageNum: 1,
				pageSize: 10,
				// 查询参数
				queryParams: {
					ipaddr: undefined,
					userName: undefined
				}
			};
		},
		methods: {
			/** 搜索按钮操作 */
			handleQuery() {
				this.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					ipaddr: undefined,
					userName: undefined
				}
				this.handleQuery();
			},
			/** 查询登录日志列表 */
			getList() {
				this.loading = true;
				list(this.queryParams).then(response => {
					console.log('查询登录日志列表', response)
					this.list = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
			/** 强退按钮操作 */
			handleForceLogout(row) {
				this.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户？').then(function() {
					return forceLogout(row.tokenId);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("强退成功");
				}).catch(() => {});
			}
		},
		mounted() {},
		created() {

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
			this.getList();
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
	.text_hidden {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
    min-height: 55px;
		// display: -webkit-box;
		// -webkit-box-orient: vertical;
		// -webkit-line-clamp: 3;
		// overflow: hidden;
	}
</style>
