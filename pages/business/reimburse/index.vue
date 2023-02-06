<!-- 报销 -->
<template>
	<view class="form_list">
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			<burseDetail ref="burseDetailRef"></burseDetail>
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
						<uni-forms-item label="项目名称" name="reimbursementName">
							<uni-easyinput type="text" v-model="queryParams.reimbursementName" placeholder="请输入标题" />
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
		
			<FormListContent
				title="reimbursementName"
				username="name"
				:list="reimburseList"
				:content="contentList"
				to="/pages/business/reimburse/burseDetail"
			></FormListContent>
			
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
		</uni-row> -->


		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">项目名称</uni-th>
					<uni-th align="center">申请人</uni-th>
					<uni-th align="center">申请时间</uni-th>
					<uni-th align="center">紧急程度</uni-th>
					<uni-th align="center">总金额</uni-th>
					<uni-th align="center"  width="80">流程状态</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in reimburseList" :key="index">
					<uni-td align="center">{{ item.reimbursementName }}</uni-td>
					<uni-td align="center">{{ item.name }}</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="bs_urgencyList" :value="item.level"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.amount }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						<TabelButton 
							:params="item" 
							:status="item.actBusinessStatus.status" 
							@update="handleUpdate(item)"
							@cancel="cancelProcessApply(item)" 
							@view="handleView(item)" 
							@delete="handleDelete(item)"
						>
						</TabelButton>
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
import burseDetail from './burseDetail'
import {listReimburse, getReimburse, delReimburse} from "@/api/demo/reimburse";
import processAip from "@/api/workflow/processInst";
	export default {
		components: {
			burseDetail
		},
		data() {
			return {
				// 分段器
				current: 0,
				colorIndex: 0,
				// 遮罩层
				loading: true,
				// 总条数
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					reimbursementName: undefined,
				},
				// table
				reimburseList: [],
				contentList:[
					{
						label: '紧急程度',
						prop: 'level',
						dict: {}
					},
					{
						label: '申请事由',
						prop: 'remarks',
					},
					{
						label: '费用金额',
						prop: 'amount',
					}
				],
				// 多选
				ids: [],
				
				// 字典
				bs_urgencyList:[],
				act_statusList:[],
				
				// 导出事件
				exportForm: {},
				buttonLoading:false,
			}
		},
		methods: {
			onClickItem(e) {
				console.log(e)
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
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
					return this.reimburseList[item].id
				})
				console.log('ids==>', this.ids)
			},
			// 查询数据
			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = true;
				listReimburse(this.queryParams).then(resp => {
					this.reimburseList = resp.rows;
					this.total = resp.total;
					this.loading = false;
				})
			},
			handleQuery() {
			  this.queryParams.pageNum = 1;
			  this.getList();
			},
			resetQuery() {
			  // this.resetForm("queryForm");
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					reimbursementName: undefined,
				};
			  this.handleQuery();
			},
			
			// 操作按钮---
			handleAdd(){
				uni.navigateTo({
					url: `/pages/business/reimburse/burseDetail?type=add`
				});
			},
			// 删除
			handleDelete(row){
				const id = row.id || this.ids;
				if(id == ""){
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delReimburse(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					that.getList();
				}).catch(() => {
					that.loading = false;
				});
			},
			handleExport(){
				this.buttonLoading = false
				this.$refs.inputDialog.open()
			},
			
			// 表格按钮---
			handleView(row) {
			  uni.navigateTo({
			  	url: `/pages/business/reimburse/burseDetail?type=view&id=${row.id}`
			  });
			},
			handleUpdate(row){
				const id = row.id || this.ids[0];
				console.log('edit-->', id)
				if(!id){
					this.$modal.msgError("请选择数据!");
					return
				}
				uni.navigateTo({
					url: `/pages/business/reimburse/burseDetail?type=edit&id=${id}`
				});
			},
			
			//撤回
			cancelProcessApply(row){
			  this.$modal.confirm('是否撤销申请').then(() => {
			    this.loading = true;
			    return processAip.cancelProcessApply(row.processInstanceId);
			  }).then(async() => {
			    this.getList();
			    this.$modal.msgSuccess("撤回成功");
			  })
				.catch(e =>{
					console.log('错误信息：',e)
					this.$modal.msgError("该单据未提交流程，无需撤销！");
				})
				.finally(() => {
			    this.loading = false;
			  });
			},
			// 导出
			sureDownload() {
				this.buttonLoading = true
			  let param = {
			    createTime: (this.exportForm.dataRange && this.exportForm.dataRange[0]) || '',
			    endDate: (this.exportForm.dataRange && this.exportForm.dataRange[1]) || ''
			  }
				console.log('======',param)
				return 
			  this.download('/demo/reimbursement/export', {...param}, `报销_${new Date().getTime()}.xls`)
			  this.buttonLoading = false
				this.$refs.inputDialog.close()
			}
		},//method
		mounted() {
		},
		created() {
			this.ids = []
			this.$getDicts("bs_urgency").then(res => {
				res.data.forEach(ele =>{
					this.contentList[0].dict[ele.dictValue] = ele.dictLabel
				})
				this.bs_urgencyList = res.data
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
			this.getList();
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
.popupDia{
	height: 27vh;
	width: 85vw;
	background-color: white;
	border-radius: 20px;
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		height: 100%;
		.item{
			width: 80%;
		}
		.item:nth-of-type(1){
			text-align: center;
			color: #a9a6a6;
		}
	}
}
</style>
