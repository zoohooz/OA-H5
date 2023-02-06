<template>
	<view class="form_list">
		
		<!-- 分段器 -->
		<uni-segmented-control :current="current" :values="['新申请','已提交']" style-type="text" active-color="black" @clickItem="onClickItem" />
		
		<view v-if="current === 0">
			<loanDetail ref="loanDetailRef"></loanDetail>
		</view>
		
		<view v-show="current === 1">
		<!-- 查询条件 -->
		<uni-collapse accordion>
			<uni-collapse-item title="搜索条件" :open="false">

				<view class="example">
					<uni-forms :model="queryParams" ref="queryForm" label-width='80px' label-align='right'>
						<uni-forms-item label="申请人" name="name">
							<uni-easyinput type="text" v-model="queryParams.name" placeholder="请输入申请人" />
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
				title="借款金额:+loanMoney"
				username="name"
				:list="tableData"
				:content="contentList"
				@click="(item) => handleView(item)"
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
		</uni-row> -->

		<!-- 表格数据 -->
		<!-- <view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center" width="100">申请人</uni-th>
					<uni-th align="center" width="80">借款金额</uni-th>
					<uni-th align="center" width="110">借款日期</uni-th>
					<uni-th align="center" width="110">归还日期</uni-th>
					<uni-th align="center" width="80">借款方式</uni-th>
					<uni-th align="center" width="80">开户行</uni-th>
					<uni-th align="center" >银行账户</uni-th>
					<uni-th align="center" >收款人手机号</uni-th>
					<uni-th align="center" >备注</uni-th>
					<uni-th align="center" width="80">状态</uni-th>
					<uni-th align="center" width="238">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center">{{ item.name }}</uni-td>
					<uni-td align="center">{{ item.loanMoney }}</uni-td>
					<uni-td align="center">{{ item.loanDate }}</uni-td>
					<uni-td align="center">{{ item.returnDate }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="bs_burse_type" :value="item.mode"></DictTag>
					</uni-td>
					<uni-td align="center">{{ item.deposit }}</uni-td>
					<uni-td align="center">{{ item.card }}</uni-td>
					<uni-td align="center">{{ item.telephone }}</uni-td>
					<uni-td align="center">{{ item.remarks }}</uni-td>
					<uni-td align="center">
						<DictTag :dict="act_statusList" :value="item.actBusinessStatus.status" type="primary"></DictTag>
					</uni-td>
					<uni-td align="center">
						<TabelButton :params="item" :status="item.actBusinessStatus.status" @update="handleUpdate(item)"
							@cancel="cancelProcessApply(item)" @view="handleView(item)" @delete="handleDelete(item)">
						</TabelButton>
					</uni-td>
				</uni-tr>
			</uni-table>
			
		</view> -->
		

	</view>
</template>

<script>
	import loanDetail from './loanDetail'
  import {listLoan,delLoan, getLoan} from "@/api/demo/loan";
	import processAip from "@/api/workflow/processInst";
	export default {
		components: {
			loanDetail
		},
		data() {
			return {
				// 分段器
				current: 0,
				colorIndex: 0,
				
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					name: undefined,
				},

				// 遮罩层
				loading: true,
				// 总条数
				total: 0,
				tableData: [],
				contentList:[
					{
						label: '借款时间',
						prop: 'loanDate',
					},
					{
						label: '还款时间',
						prop: 'returnDate',
					},
					{
						label: '借款方式',
						prop: 'mode',
						dict: {}
					}
				],

				// 多选
				ids: [],
				
				// 字典
				bs_burse_type:[],
				act_statusList:[],

				buttonLoading: false,
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
					return this.tableData[item].loanId
				})
				console.log('ids==>', this.ids)
			},
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			resetQuery() {
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					name: undefined,
				};
				this.handleQuery();
			},

			getList() {
				this.$refs?.table?.clearSelection()
				this.loading = false;
				listLoan(this.queryParams).then(resp => {
					console.log('备用金==>', resp)
					this.tableData = resp.rows;
					this.total = resp.total;
					this.loading = false;
				})
			},
			
			// 操作按钮---
			handleAdd(){
				uni.navigateTo({
					url: `/pages/business/loan/loanDetail?type=add`
				});
			},
			// 删除
			/* handleDelete(row){
				const id = row.loanId || this.ids;
				if(id == ""){
					this.$modal.msgError("请选择数据!");
					return
				}
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delLoan(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					that.getList();
				}).catch(() => {
					that.loading = false;
				});
			}, */
			
			// 表格按钮---
			handleView(row) {
			  uni.navigateTo({
			  	url: `/pages/business/loan/loanDetail?type=view&id=${row.loanId}`
			  });
			},
			/* handleUpdate(row){
				const id = row.loanId || this.ids[0];
				console.log('edit-->', id)
				if(!id){
					this.$modal.msgError("请选择数据!");
					return
				}
				uni.navigateTo({
					url: `/pages/business/loan/loanDetail?type=edit&id=${id}`
				});
			}, */
			
			//撤回
			/* cancelProcessApply(row){
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
			}, */


		},
		mounted() {},
		async created() {
			this.ids = []
			this.$getDicts("act_status").then(res => {
				this.act_statusList = res.data
			});
			
			this.bs_burse_type = await this.$getDicts('bs_burse_type').then(res =>{
					res.data.forEach(ele => {
						this.contentList[2].dict[ele.dictValue] = ele.dictLabel
					})
				  return res.data
			})
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

</style>
