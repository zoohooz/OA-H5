<template>
	<view class="example">
		<uni-forms :modelValue="burseForm" ref="form" :rules="rules" label-width='89px' label-align='right'>
			
			<uni-forms-item label="项目名称" required name="reimbursementName"> 
				<uni-easyinput  v-model="burseForm.reimbursementName" placeholder="请输入项目名称" :disabled="isView" />
			</uni-forms-item>
			<uni-forms-item label="紧急程度" required name="level">
				<!-- <uni-easyinput  v-model="burseForm.level" placeholder="请选择紧急程度" :disabled="isView" /> -->
				<uni-data-select
					:disabled="isView"
					:clear="!isView"
				  v-model="burseForm.level"
				  :localdata="bs_urgency"
				></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="报销方式" required name="mode">
				<!-- <uni-easyinput  v-model="form.leaveType" placeholder="请选择请假类型" /> -->
				<uni-data-select
					:disabled="isView"
					:clear="!isView"
				  v-model="burseForm.mode"
				  :localdata="bs_burse_type"
				></uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="提单人" required name="name">
				<uni-easyinput  v-model="burseForm.name" disabled />
			</uni-forms-item>
			<uni-forms-item label="报销事由" name="remarks">
				<uni-easyinput  v-model="burseForm.remarks" type="textarea" autoHeight  />
			</uni-forms-item>
		
		
		<uni-section title="报销明细" type="line">
			<uni-row :gutter="12">
				<uni-col :span="2.5">
					<button	class="uni-button" size="mini" type="primary" @click="handleAdd" :disabled="isView">新增</button>
				</uni-col>
				<uni-col :span="2.5">
					<button	class="uni-button" size="mini" type="warn" @click="handleDelete" :disabled="isView">删除</button>
				</uni-col>
				
				<uni-col :span="15">
					<radio-group @change="isColChange">
						<radio :checked="isColAdd">行添加</radio>
						<radio :checked="!isColAdd">弹窗添加</radio>
					</radio-group>
				</uni-col>
			</uni-row>
			
			<!-- 表格数据 -->
			<view class="uni-container">
				<uni-table ref="uniTable" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
					@selection-change="selectionChange" class='table_css'>
					<uni-tr>
						<uni-th align="center">费用日期</uni-th>
						<uni-th align="center">费用科目</uni-th>
						<uni-th align="center">费用说明</uni-th>
						<uni-th align="center" width="80">票据张数</uni-th>
						<uni-th align="center" width="115">报销金额</uni-th>
						<uni-th align="center" width="80">是否替票</uni-th>
						<uni-th align="center">相关票据</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center" :required="{label:'费用日期',prop:'conDate'}">
							<uni-datetime-picker v-model="item.conDate" type="date" v-show="!isView" />
							<span v-show="isView">{{item.conDate}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'费用科目',prop:'subjectName'}">
							<uni-data-select
								v-show="!isView"
							  v-model="item.subjectName"
							  :localdata="bs_burse_account"
							></uni-data-select>
							<span v-show="isView">{{item.subjectName}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'费用说明',prop:'explaing'}">
							<uni-easyinput v-model="item.explaing" v-show="!isView" suffixIcon="more" @iconClick="explaingClick" :disabled="isView"/>
							<span v-show="isView">{{item.explaing}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'票据张数',prop:'quantity'}">
							<uni-easyinput v-model="item.quantity" v-show="!isView" type="number" :disabled="isView"/>
							<span v-show="isView">{{item.quantity}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'报销金额',prop:'money'}">
							<uni-easyinput v-model="item.money" v-show="!isView" type="number" :disabled="isView"/>
							<span v-show="isView">{{item.money}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'是否替票',prop:'stare'}">
							<uni-data-select
								v-show="!isView"
								:disabled="isView"
								:clear="!isView"
							  v-model="item.stare"
							  :localdata="[{text:'是',value: '1'},{text:'否',value: '0'}]"
							></uni-data-select>
							<span v-show="isView">{{item.stare == '1' ? '是' : '否'}}</span>
						</uni-td>
						<uni-td align="center" :required="{label:'相关票据',prop:'avatarFile'}">
							<!-- <uni-easyinput v-model="item.avatarFile" :disabled="isView"/> -->
							<FileUpload
								:index="index"
								:readonly="isView"
								@select="select" 
								:value="item.fileLists"
								@handleView="handleView"
							></FileUpload>
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			
		</uni-section>
		<view v-show="!isForm">
			<view class="form_sub_button" v-if=" type!=='view' ">
				<button @click="submitForm('zancun')" class="line-blue">暂存	</button>
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">提交</button>
			</view>
			<view class="form_sub_button" v-else>
				<FormButton
					:params="burseForm"
					:status="burseForm.actBusinessStatus" 
					@update="handleUpdate(burseForm)"
					@cancel="cancelProcessApply(burseForm)" 
					@delete="handleDelete(burseForm)">
				</FormButton>
			</view>
		</view>
		<!-- <uni-row class="demo-uni-row bottom_button" v-if="!isForm" :gutter="12">
			<uni-col :span="8">
				<button @click="cancle">取消</button>
			</uni-col>
			<uni-col :span="8">
				<button @click="submitForm('zancun')" class="line-blue">暂存	</button>
			</uni-col>
			<uni-col :span="8">
				<button @click="submitForm" type="primary" :loading="buttonLoading" :disabled="isView">确定</button>
			</uni-col>
		</uni-row> -->
		
	</uni-forms>
	
		<bursePop ref="bursePop" :form="colRowForm" :rules="colRules"  @next="next" @submit="submit" />
	</view>
</template>

<script>
import { getReimburse, updateReimburse, addReimburse, uploadfile, delReimContent, addReimContent } from "@/api/demo/reimburse";
import { getUserProfile } from "@/api/system/user";
import processAip from "@/api/workflow/processInst";
import {valiDate, fileUrl} from "@/utils/burse";
import bursePop from "./bursePop.vue"
	export default {
		props:{
			isForm: {
				type: Boolean,
				default: false
			},
			formId:{
				type: String,
				default: ''
			}
		},
		components: {
			bursePop
		},
		data() {
			return {
				// 是否只读
				isView: false,
				// 操作类型
				type:'add',
				// 表单参数
				burseForm: {},
				// 校验
				rules:{
					reimbursementName: {
					  rules:[{ required: true, errorMessage: "项目名称不能为空" }]
					},
					level: {
					   rules:[{ required: true, errorMessage: "紧急程度不能为空"}]
					},
					mode: {
					  rules: [{ required: true,errorMessage: "报销方式不能为空"}]
					},
					name: {
					  rules: [{ required: true, errorMessage: "提单人不能为空"}]
					},
				},
				
				// 单选数据源
				bs_urgency:[],	//紧急程度
				bs_burse_type:[],	//报销方式
				bs_burse_account:[],	//费用科目
				
				// 添加方式
				isColAdd: true,
				colRowForm:{},
				colRules:{},
				
				// 表格数据
				loading:false,
				tableData:[],
				// 新增行 index
				rowIndex: 0,
				
				buttonLoading:false,
				
				// 工作流
				processInstanceId: '',// 流程实例
				taskVariables: {}, //流程变量
				taskId: undefined, //任务id
				sendMessage: {},// 消息提醒
				
				// 上传文件回显列表、样式
				fileLists: [],
				
				// 多选id
				ids:[],
			}
		},
		methods: {
			// 查看图片
			handleView(e){
				console.log('查看图片',e)
				window.open(e[0].url)
			},
			// 获取上传状态
			select({e,index}){
				console.log('选择文件：',e,index)
				const temp = e.tempFilePaths
				uploadfile({
					filePath:  temp[0],
					name: 'avatarfile'
				}).then(res =>{
				console.log('文件上传成功--->',res)
				
					this.tableData[index].avatarFile = res.url
					this.tableData[index].fileName = res.FileName
					console.log('url--->',fileUrl(res.url))
				}).catch(e =>{
					this.$modal.msgError("文件上传失败!请检查文件大小及文件类型。")
				})
			},
			isColChange(e){
				this.isColAdd = !this.isColAdd
			},
			handleAddBefore(){
				let {length} = this.tableData
				let newIndex = length > 0 ? this.tableData.sort((a,b) => a.id - b.id)[length-1].id : 0
				// this.rowIndex = ++newIndex
				return {
				  id: ++newIndex,
				  conDate: null,
				  subjectName: null,
				  content: null,
				  quantity: null,
				  money: null,
				  canEdit: true,
				  stare: null,
				  // 文件
				  avatarFile:null,
				  fileName:null,
					reimContentId: null,//行id
				};
			},
			handleAdd(){
				let row = this.handleAddBefore()
				if(!this.isColAdd){
					this.colRowForm = row
					this.$refs.bursePop.open()
					return
				}
				this.tableData.push(row);
			},
			next(colData){
				console.log('next==>',colData)
				this.tableData.push(colData);
				this.colRowForm = this.handleAddBefore()
			},
			submit(colData){
				console.log('submit==>',colData)
				this.tableData.push(colData);
			},
			// 删除行
			handleDelete(){
				let arr = []
				console.log('---',this.tableData)
				this.ids.forEach(ele =>{
				  this.tableData.forEach((item,index) =>{
				    if(ele == item.id){
				      this.tableData.splice(index,1)
							item.reimContentId !== null ? arr.push(item.reimContentId) : ''
				    }
				  })
				})
				if(this.burseForm.id != null){
					//调删除子表数据接口
					if(arr.length > 0){
						delReimContent(arr.join(','))
					}
				}
			},
			// 费用说明点击按钮
			explaingClick(){
				console.log('费用说明')
			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index)
				this.ids = e.detail.index.map(item => {
					return this.tableData[item].id
				})
				console.log('ids==>',this.ids)
			},
			async submitForm(type) {
				console.log('table===>',this.tableData)
				this.$refs.form.validate(async valid => {
					// 表单必填
					if (!valid) {
						// 如果不是暂存则验证表格必填
						if(type !== 'zancun'){
							if(valiDate(this.$refs.uniTable,this.tableData)){
							  return
							}
						}
						//暂存时明细必填
						if(this.tableData.length == 0){
						  this.$modal.msgError('请至少添加一条明细再进行暂存操作')
						  return
						}
						
						this.burseForm.amount = 0
						this.tableData.forEach(ele =>{
						  this.burseForm.amount += Number(ele.money)
						})
						this.burseForm.list = this.tableData
						let result;
						if (this.burseForm.id != null) {
							// 修改子表
							let list = this.reimContentHandle(this.burseForm)
							if(list.length > 0){
								 await addReimContent(list)
							}
						  result = await updateReimburse(this.burseForm).then(resp => {
						    this.$modal.msgSuccess("修改成功");
						    return resp
						  })
						} else {
						  result = await addReimburse(this.burseForm).then(resp => {
						    this.$modal.msgSuccess("新增成功");
						    uni.setNavigationBarTitle({
						    	title:'修改报销业务'
						    })
						    this.burseForm.id = resp.data.id
						    return resp
						  })
						}
						// 新增、修改 后
						if(type == 'zancun'){
							const pages = getCurrentPages();
							const currentPage  = pages[pages.length - 1];
							currentPage.onClickItem({currentIndex: 1})
						}else{
						  this.sendMessage = {
						    title:'报销申请',
						    messageContent:'单据【'+result.data.id+"】申请"
						  }
						  this.submitFormApply(result.data)
						}
						
					}// 表单必填验证
					else{
						if(type == 'zancun'){
						  this.$modal.msgError('请填写完基本信息并至少添加一条明细再进行暂存!')
						}
					}
				})
			},
			cancle(){
				this.$tab.navigateBack(1)
			},
			reimContentHandle({id,list}){
				return list.filter(ele => ele.reimContentId == null)
				.map(item =>{
					return {...item,reId: id}
				})
			},
			
			//提交流程
			submitFormApply(entity){
			  let variables = {
			    entity: entity
			  }
			  const data = {
			    processKey: 'burse', // key
			    businessKey: entity.id, // 业务id
			    variables: variables,
			    classFullName: 'com.ycyy.demo.domain.Reimbursement'
			  }
			  // 启动流程
			  processAip.startProcessApply(data).then(response => {
			    this.taskId = response.data.taskId;
			    // 查询下一节点的变量
			    this.taskVariables = {
			      entity: entity,  // 变量
			      userId: '1',
			    }
					let item = {
						taskId:this.taskId,
						taskVariables:this.taskVariables,
						sendMessage:this.sendMessage,
						navigateBack: this.type == 'add' ? 1 : 2,
					}
					let data =  encodeURIComponent(JSON.stringify(item))
					
					this.$tab.navigateTo(
						`/components/Process/Verify?data=${data}`
					)
					return
			  })
			},
			getReimburseData(id){
			  this.loading = true;
				getReimburse(id).then(resp => {
					this.loading = false;
					this.burseForm = resp.data;
					this.tableData = resp.data.list.map((item,index) =>{
						if(item.fileName){
							let urlArr = item.fileName.split('.')
							return {
								...item,
								id: index,
								fileLists: [{
									url: fileUrl(item.avatarFile),
									extname: urlArr[urlArr.length-1],
									name: item.fileName,
								}] 
							}
						}else{
							return {
								...item,
								id: index,
							}
						}
					})
					
					this.processInstanceId=resp.data.processInstanceId
				});
			},
			
			//流程操作
			async handleUpdate(form){
				this.type = 'edit'
				uni.setNavigationBarTitle({
					title:'修改报销业务'
				})
				await this.getReimburseData(form.id)
				this.isView = false
			},
			//撤回
			cancelProcessApply(form){
				let row = form.actBusinessStatus
			  this.$modal.confirm('是否撤销申请').then(() => {
			    this.loading = true;
			    return processAip.cancelProcessApply(row.processInstanceId);
			  }).then(async() => {
			    this.getReimburseData(form.id)
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
			// 删除
			handleDelete({id}){
				let that = this
				that.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
					that.loading = true;
					return delReimburse(id);
				}).then(() => {
					that.loading = false;
					that.$modal.msgSuccess("删除成功");
					setTimeout(() =>{
						that.$tab.navigateBack(1)
					},1000)
				}).catch(() => {
					that.loading = false;
				});
			},
		},
		async created() {
			// 获取字典 
			this.bs_urgency = await this.$getDictsList('bs_urgency')
			this.bs_burse_type = await this.$getDictsList('bs_burse_type')
			this.bs_burse_account = await this.$getDictsList('bs_burse_account')
			// 获取部门id
			if(this.type == 'add'){
				console.log('getUserProfile')
				getUserProfile().then(res =>{
				  this.burseForm.deptId = res.data.user.deptId
				  this.burseForm.userId  = res.data.user.userId
					this.$set(this.burseForm,'name',res.data.user.nickName)
				})
				// 默认值
				this.burseForm.level = '1'
				this.burseForm.mode = '1'
			}
			// 是否来自工作流表单
			if( this.isForm ){
				this.isView = true
				this.getReimburseData(this.formId)
			}
		},
		mounted() {
		},
		/*监听页面滚动*/
		onPageScroll() {},
		onLoad(option) {
			//页面初次渲染完成
			console.log('option-->',option)
			let { type } = option
			this.type = type
			if( type === 'edit' ){
				uni.setNavigationBarTitle({
					title:'修改报销业务'
				})
				this.getReimburseData(option.id)
				
			}else if( type === 'add' ){
				uni.setNavigationBarTitle({
					title:'新增报销业务'
				})
				// 获取部门id
				getUserProfile().then(res =>{
				  this.burseForm.deptId = res.data.user.deptId
				  this.burseForm.userId  = res.data.user.userId
					this.$set(this.burseForm,'name',res.data.user.nickName)
				})
				// 默认值
				this.burseForm.level = '1'
				this.burseForm.mode = '1'
			}else if( type === 'view' ){
				uni.setNavigationBarTitle({
					title:'查看报销业务'
				})
				this.isView = true
				this.getReimburseData(option.id)
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

<style scoped lang="scss">
.table_css{
	padding-bottom: 300px;
}
.bottom_button{
	position: fixed;
	bottom: 2px;
	width: 100%;
	padding-right: 20px;
}


</style>