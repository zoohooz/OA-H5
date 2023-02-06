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
						<uni-forms-item label="登录地址">
							<uni-easyinput type="text" v-model="queryParams.ipaddr" placeholder="请输入登录地址" />
						</uni-forms-item>
						<uni-forms-item label="用户名称">
							<uni-easyinput type="text" v-model="queryParams.userName" placeholder="请输入用户名称" />
						</uni-forms-item>
						<uni-forms-item label="状态">
							<uni-data-select v-model="queryParams.status" :localdata="sys_common_statusList">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="登录时间">
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

		<FormListContent
		  title="用户名称: +userName"
			:dictTag="{
				dict: act_statusList,
				value: 'status',
			}"
			:list="list"
			:content="contentList"
			createTime="loginTime"
			@click="(item) => handleView(item)"
		></FormListContent>
		
		<view class="uni-pagination-box">
			<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
				:total="total" @change="change" />
		</view>
	</view>
</template>

<script>
import { list, delLogininfor, cleanLogininfor } from "@/api/monitor/logininfor";
	export default {
		components: {},
		data() {
			return {
				list:[],
				contentList:[
					{
						label: '登录地址',
						prop: 'ipaddr',
					},
					{
						label: '登录地点',
						prop: 'loginLocation',
					},
					{
						label: '浏览器',
						prop: 'browser',
					},
					{
						label: '操作系统',
						prop: 'os',
					},
					{
						label: '操作信息',
						prop: 'msg',
					}
				],
				
				// 查询参数
				      queryParams: {
				        pageNum: 1,
				        pageSize: 10,
				        ipaddr: undefined,
				        userName: undefined,
				        status: undefined
				      },
							dateRange:[],
				// 总条数
				      total: 0,
				
				act_statusList:[],
				sys_common_statusList:[],
				
			}
		},
		methods: {
			/** 搜索按钮操作 */
			    handleQuery() {
			      this.queryParams.pageNum = 1;
			      this.getList();
			    },
			/** 重置按钮操作 */
			    resetQuery() {
			      this.dateRange = [];
						this.queryParams = {
						  pageNum: 1,
						  pageSize: 10,
						  ipaddr: undefined,
						  userName: undefined,
						  status: undefined
						};
			      this.handleQuery();
			    },
			/** 查询登录日志 */
			    getList() {
						console.log('操作日志-getlist查询',this.dateRange)
						if(this.dateRange.length > 0){
							console.log('--1')
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
				return
			},
		},
		mounted() {
		},
		async created() {
			this.dateRange = []
			this.getList();
			// this.$getDicts("sys_common_status").then(res => {
			// 	res.data.forEach(ele => {
			// 		this.contentList[0].dict[ele.dictValue] = ele.dictLabel
			// 	})
			// })
			this.act_statusList  = await this.$getDicts("sys_common_status").then(res => {
				return res.data
			});
			
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