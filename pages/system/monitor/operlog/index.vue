<template>
	<view class="form_list">
		
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
						<uni-forms-item label="系统模块">
							<uni-easyinput type="text" v-model="queryParams.title" placeholder="请输入系统模块" />
						</uni-forms-item>
						<uni-forms-item label="操作人员">
							<uni-easyinput type="text" v-model="queryParams.operName" placeholder="请输入操作人员" />
						</uni-forms-item>
						<uni-forms-item label="类型">
							<uni-data-select v-model="queryParams.businessType" :localdata="sys_oper_typeList">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="状态">
							<uni-data-select v-model="queryParams.status" :localdata="sys_common_statusList">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="操作时间">
							<uni-datetime-picker v-model="dateRange" type="daterange" rangeSeparator="至"  />
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
		<!-- 列表数据 -->
		
		<FormListContent
		  title="日志模块: +title"
			:hasStatus="false"
			:list="list"
			:content="contentList"
			username="operName"
			createTime="operTime"
			@click="(item) => handleView(item)"
		></FormListContent>
		
		<view class="uni-pagination-box">
			<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
				:total="total" @change="change" />
		</view>
	</view>
</template>

<script>
import { list, delOperlog, cleanOperlog } from "@/api/monitor/operlog";
	export default {
		components: {},
		data() {
			return {
				list:[],
				contentList:[
					{
						label: '操作类型',
						prop: 'businessType',
						dict:{}
					},
					{
						label: '请求方式',
						prop: 'requestMethod',
					},
					{
						label: '操作状态',
						prop: 'status',
						dict:{}
					}
				],
				
				// 查询参数
				      queryParams: {
				        pageNum: 1,
				        pageSize: 10,
				        title: undefined,
				        operName: undefined,
				        businessType: undefined,
				        status: undefined
				      },
							dateRange:[],
				// 总条数
				      total: 0,
				
				sys_oper_typeList:[],
				sys_common_statusList:[],
			}
		},
		methods: {
			/** 重置按钮操作 */
			    resetQuery() {
			      this.dateRange = [];
						this.queryParams = {
				        pageNum: 1,
				        pageSize: 10,
				        title: undefined,
				        operName: undefined,
				        businessType: undefined,
				        status: undefined
				      },
			      this.handleQuery();
			    },
			/** 搜索按钮操作 */
			    handleQuery() {
			      this.queryParams.pageNum = 1;
			      this.getList();
			    },
			/** 查询登录日志 */
			    getList() {
						console.log('操作日志-getlist查询')
						if(this.dateRange){
							this.queryParams['params[beginTime]'] = this.dateRange[0]
							this.queryParams['params[endTime]'] = this.dateRange[1] 
						}
			      list(this.queryParams).then( response => {
			          console.log('res-->',response)
								this.list = response.rows;
			          this.total = response.total;
			        }
			      );
			    },
			handleView(row){
				console.log('operLog-->',row)
				let data = encodeURIComponent(JSON.stringify(row))
				console.log('21211',data)
				this.$tab.navigateTo(
					`/pages/system/monitor/operlog/operLogInfo?data=${data}`
				)
			},
		},
		mounted() {
		},
		async created() {
			this.getList();
			this.$getDicts("sys_oper_type").then(res => {
				res.data.forEach(ele => {
					this.contentList[0].dict[ele.dictValue] = ele.dictLabel
				})
			})
			
			this.$getDicts("sys_common_status").then(res => {
				res.data.forEach(ele => {
					this.contentList[2].dict[ele.dictValue] = ele.dictLabel
				})
			})

			this.sys_oper_typeList = await this.$getDictsList('sys_oper_type')
			this.sys_common_statusList = await this.$getDictsList('sys_common_status')
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
			console.log('operlog=========')
			// this.getList();
			this.$getDicts("sys_oper_type").then(res => {
				res.data.forEach(ele => {
					this.contentList[0].dict[ele.dictValue] = ele.dictLabel
				})
			})
			
			this.$getDicts("sys_common_status").then(res => {
				res.data.forEach(ele => {
					this.contentList[2].dict[ele.dictValue] = ele.dictLabel
				})
			})
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