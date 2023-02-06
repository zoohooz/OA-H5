<template>
	<view class="example">
		<uni-forms :modelValue="queryParams" ref="queryForm" label-width='68px' label-align='right'>

			<uni-forms-item label="归属部门" name="deptId">
				<!-- <uni-easyinput v-model="queryParams.deptId" type="number" placeholder="请选择归属部门" /> -->
				<DeptSelect @confirm="confirm" :label="deptLabel"></DeptSelect>
			</uni-forms-item>
			<uni-forms-item label="用户名称" name="userName">
				<uni-easyinput v-model="queryParams.userName" placeholder="请输入用户名称" />
			</uni-forms-item>
			<uni-forms-item label="手机号码" name="phonenumber">
				<uni-easyinput v-model="queryParams.phonenumber" placeholder="请输入手机号码" />
			</uni-forms-item>
			<!-- 按钮 -->
			<uni-row class="demo-uni-row">
				<uni-row span="12">
					<button @click="resetQuery" form-type="reset">重置</button>
				</uni-row>
				<uni-row span="12">
					<button @click="handleQuery" form-type="submit" type="primary">搜索</button>
				</uni-row>
			</uni-row>
		</uni-forms>

		<!-- 表格数据 -->
		<view class="uni-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
				@selection-change="selectionChange">
				<uni-tr>
					<uni-th align="center">用户编号</uni-th>
					<uni-th align="center">用户名称</uni-th>
					<uni-th align="center">用户昵称</uni-th>
					<uni-th align="center">部门</uni-th>
					<uni-th align="center">手机号码</uni-th>
					<uni-th align="center">创建时间</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in userList" :key="index">
					<uni-td align="center">{{ item.userId }}</uni-td>
					<uni-td align="center">{{ item.userName }}</uni-td>
					<uni-td align="center">{{ item.nickName }}</uni-td>
					<uni-td align="center">{{ item.deptName }}</uni-td>
					<uni-td align="center">{{ item.phonenumber }}</uni-td>
					<uni-td align="center">{{ item.createTime }}</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="queryParams.pageSize" :current="queryParams.pageNum"
					:total="total" @change="change" />
			</view>
		</view>
		
		<!-- tag -->
		<uni-tag 
			v-for="(user,index) in chooseUserList" :key="index" style="margin:2px"
		  @click="handleCloseTag(user)"
			custom-style="customStyle" 
			:inverted="true" 
			:text="user.userName" 
			type="primary"
			/>
		
		<!-- 确认按钮 -->
		<uni-row class="demo-uni-row" style="padding-top: 10px;">
			<uni-col :span="12">
					<button @click="cancel">取消</button>
				</uni-col>
			<uni-col :span="12">
				<button @click="confirmUser" type="primary" :loading="buttonLoading" >确定</button>
			</uni-col>
		</uni-row>



	</view>
	</view>
</template>

<script>
	import {
		getWorkflowUserListByPage
	} from "@/api/workflow/workflowUser";
	import DeptSelect from "@/components/DeptSelect/DeptSelect.vue"
	export default {
		components: {
			DeptSelect
		},
		data() {
			return {
				// 是否多选
				nodeId: '',
				// 查询参数
				queryParams: {
				  pageNum: 1,
				  pageSize: 10,
				  userName: undefined,
				  phonenumber: undefined,
				  deptId: undefined,
				  type: 'person',
				  ids:[]
				},
				// 遮罩层
				loading: true,
				// 总条数
				total: 0,
				// 用户表格数据
				userList: [],
				// 保存选择的用户
				chooseUserList: [],
				// 按钮状态
				buttonLoading:false,
				
				// 部门回显名称 暂时没有数回显选择
				deptLabel:''
			}
		},
		methods: {
			confirm(e){
				this.queryParams.deptId = e[0].id
				this.deptLabel = e[0].label
				this.getList()
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
					return this.userList[item].userId
				})
				this.chooseUserList = e.detail.index.map(ele => {
					return this.userList[ele]
				})
				console.log('ids==>', this.chooseUserList)
			},
			/** 查询用户列表 */
			getList() {
			  this.loading = true;
			  getWorkflowUserListByPage(this.queryParams).then(response => {
			      let res = response.data.page
			      this.userList = res.rows;
			      this.total = res.total;
			       //反选
			      if(this.flag && response.data.list){
			        this.chooseUserList = response.data.list
			        response.data.list.forEach(row => {
			          this.$refs.multipleTable.toggleRowSelection(row,true);
			        })
			      }
			      this.loading = false;
			    });
			},
			/** 搜索按钮操作 */
		  handleQuery() {
		    this.flag = false
		    this.queryParams.pageNum = 1;
		    this.getList();
		  },
		  /** 重置按钮操作 */
		  resetQuery() {
		    this.queryParams.deptId = ''
		    this.queryParams.phonenumber = ''
		    this.queryParams.userName = ''
		    this.handleQuery();
		  },
			cancel(){
				this.$tab.navigateBack(1)
			},
			// 删除tag
			handleCloseTag(user){
			  this.chooseUserList.splice(this.chooseUserList.indexOf(user), 1);
				
			  this.$refs.table.toggleRowSelection(this.userList.indexOf(user),false)
				
			   this.userList.forEach((row,index)=>{
			      if(user.userId === row.userId){
			         this.$refs.table.toggleRowSelection(index,false)
			      }
			   })
			},
			// 确认
			confirmUser() {
				if (this.chooseUserList.length > 0) {
					// 调用上一个页面方法
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2];
					prevPage.$vm.confirmSysDeptUser(this.chooseUserList)
					this.$tab.navigateBack(1)
				} else {
					this.$modal.msgError("请选择人员！");
				}
			}
		},
		watch: {
			
		},
		mounted() {},
		created() {

		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('选择人员组件-->', option)
			let {
				data
			} = option
			//回显的数据
			this.propUserList = data.userList
		},
		onReady() {
			//页面初次渲染完成
		},
		onShow() {
			//页面显示再次执行
			// this.getTreeselect();
			this.getList();
		},
		onHide() {
			//页面隐藏再次执行
			 this.chooseUserList = []
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
