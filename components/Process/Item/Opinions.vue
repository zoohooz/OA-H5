<!-- 审批意见 -->
<template>
	<!-- 表格数据 -->
	<view class="opinions_table">
		<!-- 多选 type="selection" @selection-change="selectionChange" -->
		<uni-table ref="table" :loading="loading" border stripe  emptyText="暂无更多数据"
			>
			<uni-tr>
				<uni-th align="center">任务名称</uni-th>
				<uni-th align="center">办理人</uni-th>
				<uni-th align="center">状态</uni-th>
				<uni-th align="center">审批意见</uni-th>
				<uni-th align="center">开始时间</uni-th>
				<uni-th align="center">结束时间</uni-th>
				<uni-th align="center" v-if="editMessage">操作</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in list" :key="index">
				<uni-td align="center">{{ item.name }}</uni-td>
				<uni-td align="center">{{ item.nickName }}</uni-td>
				<uni-td align="center">{{ item.status }}</uni-td>
				<uni-td align="center">{{ item.comment }}</uni-td>
				<uni-td align="center">{{ item.startTime }}</uni-td>
				<uni-td align="center">{{ item.endTime }}</uni-td>
				<uni-td v-if="editMessage">
					<view class="uni-group">
						<button class="uni-button" size="mini" type="primary" plain="true"
							@click="handleClick(item)">编辑意见</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
import apiProcessInst from '@/api/workflow/processInst'
	export default {
		props: {
		  processInstanceId: String,
		  editMessage: {
		    type: Boolean,
		    default: false
		  },
		},
		components: {},
		data() {
			return {
				list: [],
				loading: false,
				
				
			}
		},
		watch: {
		  processInstanceId: {
		    handler(newVal,oldVal){
		      if(newVal) {
		        this.loading = true
		        // 审批历史数据
		        this.getHistoryInfoList()
		        // 通过流程实例id获取历史流程图
		        // this.url = process.env.VUE_APP_BASE_API+'/workflow/processInstance/getHistoryProcessImage?processInstanceId='+newVal
		      }
		    },
		    immediate: true,
		    deep:true
		  }
		},
		methods: {
			// 查询审批历史记录
			async getHistoryInfoList() {
			  const { data } = await apiProcessInst.getHistoryInfoList(this.processInstanceId)
			  this.list = data
			  this.loading = false
			},
			
			// 2022-11-30
			// 打开编辑意见 未完成
			handleClick(row){
			  this.commentId = row.commentId
			  this.comment = row.comment
			  this.dialogVisible = true
			},
			// 编辑意见
			async clickUpdate(){
			  const {code,msg} = await taskApi.editComment(this.commentId,this.comment)
			  if(code === 200){
			    this.$modal.msgSuccess(msg);
			    this.dialogVisible = false
			    this.getHistoryInfoList()
			  }
			}
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
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
.opinions_table{
	margin-top: 50px;
}
</style>
