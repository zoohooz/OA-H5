<template>
	<view>
		<!-- 查询条件 -->
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="true">

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="部门名称">
							<uni-easyinput type="text" v-model="queryParams.deptName" placeholder="请输入部门名称" />
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
		<!-- 操作按钮 -->
		<uni-row class="demo-uni-row example" :gutter="10">
			<uni-col :span="2.5">
				<button @click="itemAdd" class="cu-btn sm block line-blue">
					<text class="cuIcon-add"></text> 新增
				</button>
			</uni-col>
			<!-- <uni-col :span="2.5">
				<button @click="handleDelete" class="cu-btn sm block line-red">
					<text class="cuIcon-delete"></text> 展开/折叠
				</button>
			</uni-col> -->
		</uni-row>
		<!-- 表格数据 -->
	<!-- 	<ly-tree :tree-data="treeData" 
		        :ready="ready"
		        node-key="deptId" 
		        @node-expand="handleNodeExpand" 
		        @node-click="handleNodeClick">
		        </ly-tree> -->
			<uni-card :is-shadow="false" is-full >
				<view class="uni-container">
					<!-- 基本用法 -->
					<winext-tree :data="completeData" dataKey="deptName" defaultOpen="true" arrayKey="deptId" childrenKey="children"
						@itemClick="itemClick">
						<template v-slot="slotData">
							<span @click="itemAdd(slotData)" style="margin-right:3px">
								<uni-icons type="plusempty"></uni-icons>添加
							</span>
							<span @click="itemEdit(slotData)" style="margin-right:3px">
								<uni-icons type="compose"></uni-icons>修改
							</span>
							<span @click="itemDel(slotData)">
								<uni-icons type="trash"></uni-icons>删除
							</span>
						</template>
					</winext-tree>
				</view>
			</uni-card>
		


	</view>
</template>

<script>
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	import {
		listDept,
		delDept
	} from "@/api/system/dept";
	export default {
		components: {LyTree},
		data() {
			return {
				// 查询参数
				queryParams: {
					deptName: undefined,
					status: undefined
				},
				completeData: [],
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
				defaultOpen:true,
				ids: [],

				// 遮罩层
				loading: true,
				// 请假业务表格数据
				leaveList: [],
				dateRange: [],
            ready: false
			}
		},
		methods: {
			itemClick(item) {
				//item 当前节点相关参数
				//点击范围不包括左侧图标与右侧自定义内容
				console.log(item)
			},
			itemEdit(slotItem) {
				console.log('修改', slotItem.item.deptId)
				const id = slotItem.item.deptId
				uni.navigateTo({
					url: `pages/system/dept/deptDetails?type=edit&id=${id}`
				});
			},
			itemAdd(slotItem) {
				console.log('添加', slotItem.item)
				if (slotItem.item != undefined) {
					const id = slotItem.item.deptId
					const data = slotItem.item.deptName
					uni.navigateTo({
						url: `pages/system/dept/deptDetails?type=add&id=${id}&data=${data}`
					});
				} else {
					uni.navigateTo({
						url: `pages/system/dept/deptDetails?type=addIn`
					});
				}

			}, 
			// handleNodeClick(obj) {
   //          console.log('handleNodeClick', JSON.stringify(obj));
   //      },
   //      handleNodeExpand(obj) {
   //          console.log('handleNodeExpand', JSON.stringify(obj));
   //      },
			/** 搜索按钮操作 */
			handleQuery() {
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams = {
					deptName: undefined,
					status: undefined
				}
				// this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询岗位管理列表 */
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listDept(this.queryParams).then(response => {
					console.log('部门=>', response)
					this.completeData = this.handleTree(response.data, "deptId");
					this.loading = false;
				});
			},
			// 删除
			itemDel(row) {
				console.log('row', row)
				const id = row.item.deptId
				// console.log('handleDelete====',id)
				if (id == "") {
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + row.item.deptName + '"的数据项？').then(function() {
					that.loading = true;
					return delDept(id);
				}).then(() => {
					that.loading = false;;
					that.getList();
					that.$modal.msgSuccess("删除成功")
				}).catch(() => {
					that.loading = false;
				});
			}
		},

		created() {},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad() {
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面初次渲染完成
			this.getList()
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
